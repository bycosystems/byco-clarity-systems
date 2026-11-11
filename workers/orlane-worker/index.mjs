// ORLANE WORKER v1
// Remplace les scenarios Make 6258639 (WhatsApp), 6175623 (appels Vapi), 7129980 (API RFM), 6999106 (recap 2 jours)
// Liaison D1 : DB
// Variable (texte, non secrète) : TWILIO_ACCOUNT_SID
// v4 : le récap d'appel indique le prospect (lien de démo) et « appel web » sans numéro
// Secrets : ANTHROPIC_KEY, TWILIO_USER, TWILIO_PASS, RESEND_KEY, HOOK_KEY
// Cron (UTC) : 5 16 */2 * *
// Routes : /whatsapp (Twilio), /vapi (Vapi), /interactions (RFM), toutes avec ?k=HOOK_KEY

const C = {
  waFrom: "whatsapp:+447576594092",
  voiceFrom: "+447576594092",
  studioFlow: "FW59ea5d46edcd1f48dfde964e4595d53b",
  tplFr: "HXae25d57d42b95359774ed73fe4e2de24",
  tplEn: "HXbb46afb4721d6e7d3655bb410d83383a",
  mailTo: "contact.byco@gmail.com",
  mailFrom: "Orlane <orlane@bycosystems.xyz>",
  modelReply: "claude-sonnet-4-6",
  modelExtract: "claude-haiku-4-5-20251001",
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

// ===== BLOC DÉMO (patch 1) : à coller dans orlane-worker, au-dessus de "export default" =====
const DEMO_ORIGINS = ["https://bycosystems.xyz", "https://www.bycosystems.xyz"];

function demoCors(request) {
  const o = request.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin": DEMO_ORIGINS.includes(o) ? o : DEMO_ORIGINS[0],
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function demoJson(request, obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...demoCors(request), "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

async function demoIpHash(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const data = new TextEncoder().encode(ip + "|" + (env.HOOK_KEY || ""));
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].slice(0, 8).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function demoLog(request, env, slug, kind, extra) {
  try {
    await env.DB.prepare(
      "INSERT INTO demo_events (slug, kind, country, ip_hash, extra) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(slug, kind, (request.cf && request.cf.country) || "", await demoIpHash(request, env), String(extra || "").slice(0, 80))
      .run();
  } catch (e) {
    /* journal non bloquant */
  }
}

// Retourne une Response pour les routes /demo/*, ou null pour laisser le Worker continuer.
async function handleDemo(request, env) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/demo/")) return null;
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: demoCors(request) });
  if (request.method !== "POST") return demoJson(request, { ok: false }, 405);
  const origin = request.headers.get("Origin");
  if (!DEMO_ORIGINS.includes(origin)) return demoJson(request, { ok: false, reason: "origin" }, 403);

  let body = {};
  try { body = JSON.parse(await request.text()); } catch (e) { /* corps vide */ }
  const slug = String(body.p || "").normalize("NFC").trim().toLowerCase().slice(0, 80);
  const route = url.pathname.slice("/demo/".length);

  const row = slug
    ? await env.DB.prepare("SELECT name, first_message, max_calls, active FROM demo_prospects WHERE slug = ?").bind(slug).first()
    : null;
  const known = !!row && row.active === 1;

  if (route === "open" || route === "click-whatsapp" || route === "click-form" || route === "started") {
    if (known) await demoLog(request, env, slug, route === "open" ? "open" : route === "started" ? "started" : route, body.extra);
    return demoJson(request, { ok: true });
  }

  if (route === "gate") {
    if (env.DEMO_CALLS_ENABLED === "0") {
      await demoLog(request, env, known ? slug : null, "gate_off", "");
      return demoJson(request, { ok: false, reason: "unavailable" });
    }
    if (!known) {
      await demoLog(request, env, null, "gate_unknown", slug.slice(0, 40));
      return demoJson(request, { ok: false, reason: "unknown" });
    }
    const c = await env.DB.prepare("SELECT COUNT(*) AS n FROM demo_events WHERE slug = ? AND kind = 'started'").bind(slug).first();
    const used = (c && c.n) || 0;
    if (used >= row.max_calls) {
      await demoLog(request, env, slug, "gate_limit", "");
      return demoJson(request, { ok: false, reason: "limit" });
    }
    await demoLog(request, env, slug, "gate_ok", "");
    return demoJson(request, { ok: true, remaining: row.max_calls - used, name: row.name, first_message: row.first_message });
  }

  return demoJson(request, { ok: false }, 404);
}
// ===== FIN DU BLOC DÉMO =====

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    // Démo du site (patch 1) : routes /demo/*, avant la vérification de la clé ?k=
    const demoResponse = await handleDemo(req, env);
    if (demoResponse) return demoResponse;
    if (url.pathname === "/public/rfm") return publicRfm(req, env);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (!env.HOOK_KEY || url.searchParams.get("k") !== env.HOOK_KEY) {
      return new Response("forbidden", { status: 403 });
    }
    try {
      if (url.pathname === "/whatsapp" && req.method === "POST") {
        const p = Object.fromEntries(await req.formData());
        ctx.waitUntil(safe(env, "whatsapp", () => handleWhatsapp(env, p)));
        return new Response("<Response></Response>", { headers: { "content-type": "text/xml" } });
      }
      if (url.pathname === "/vapi" && req.method === "POST") {
        const b = await req.json();
        ctx.waitUntil(safe(env, "vapi", () => handleVapi(env, b)));
        return json({ ok: true });
      }
      if (url.pathname === "/interactions") return await handleList(env);
    } catch (e) {
      console.log("fetch", String(e));
      return new Response("error", { status: 500 });
    }
    return new Response("not found", { status: 404 });
  },

  async scheduled(_ev, env, ctx) {
    ctx.waitUntil(safe(env, "recap", () => recap(env)));
  },
};

// ---------- utilitaires ----------

const s = (v) => (v === null || v === undefined ? "" : String(v));
const esc = (t) => s(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const json = (o) => new Response(JSON.stringify(o), { headers: { "content-type": "application/json", ...CORS } });

async function safe(env, name, fn) {
  try {
    await fn();
  } catch (e) {
    console.log(name, String(e));
    try {
      await mail(env, "Erreur Orlane (" + name + ")", "<pre>" + esc(String(e)) + "</pre>");
    } catch (_) {}
  }
}

async function claude(env, body) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("Anthropic " + r.status + " " + (await r.text()).slice(0, 300));
  const d = await r.json();
  return (d.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
}

async function twilio(env, url, params) {
  const r = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(env.TWILIO_USER + ":" + env.TWILIO_PASS),
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params),
  });
  if (!r.ok) throw new Error("Twilio " + r.status + " " + (await r.text()).slice(0, 300));
  return r;
}
const msgUrl = (env) => {
  if (!env.TWILIO_ACCOUNT_SID) throw new Error("Variable TWILIO_ACCOUNT_SID manquante");
  return "https://api.twilio.com/2010-04-01/Accounts/" + env.TWILIO_ACCOUNT_SID + "/Messages.json";
};

async function mail(env, subject, html) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + env.RESEND_KEY, "content-type": "application/json" },
    body: JSON.stringify({ from: C.mailFrom, to: [C.mailTo], subject, html }),
  });
  if (!r.ok) throw new Error("Resend " + r.status + " " + (await r.text()).slice(0, 300));
}

function parseJson(txt) {
  const t = "{" + s(txt);
  try {
    return JSON.parse(t);
  } catch (_) {
    const m = t.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch (_) {}
    }
  }
  return null;
}

const getRec = (env, key) => env.DB.prepare("SELECT * FROM interactions WHERE key = ?").bind(key).first();

const putRec = (env, key, d) =>
  env.DB.prepare(
    `INSERT INTO interactions (key, channel, prospect_name, sector, language, summary, status, next_action, created_at, duration_s, email_sent, historique)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET
       channel = excluded.channel, prospect_name = excluded.prospect_name, sector = excluded.sector,
       language = excluded.language, summary = excluded.summary, status = excluded.status,
       next_action = excluded.next_action, created_at = excluded.created_at, duration_s = excluded.duration_s,
       email_sent = excluded.email_sent, historique = excluded.historique`
  )
    .bind(
      key, s(d.channel), s(d.prospect_name), s(d.sector), s(d.language), s(d.summary), s(d.status),
      s(d.next_action), s(d.created_at), s(d.duration_s), s(d.email_sent), s(d.historique)
    )
    .run();

// ---------- WhatsApp (ex scenario 6258639) ----------

function prices(from) {
  const afr = ["+237", "+221", "+225"].some((p) => from.includes(p));
  return afr
    ? { e: "343 900 FCFA", b: "694 900 FCFA", p: "1 045 800 FCFA", x: "1 396 700 FCFA" }
    : { e: "490 euros", b: "990 euros", p: "1 490 euros", x: "1 990 euros" };
}

function buildSystem(from) {
  const P = prices(from);
  return `Tu es Orlane, l'assistante commerciale virtuelle de ByCo Systems. ByCo Systems automatise l'accueil des entreprises de services : réceptionniste IA vocale 24h/24, automatisation WhatsApp, prise de rendez-vous automatique, suivi client automatisé. PRIX POUR CETTE CONVERSATION, déjà déterminés selon le numéro du prospect, ne les recalcule jamais et n'utilise jamais d'autre montant : Essential = ${P.e}, Business = ${P.b}, Business+ = ${P.p}, Premium = ${P.x}. Quand tu présentes les formules, commence toujours par Business+ avec sa raison d'être en une phrase, puis Business, puis Essential, puis Premium en dernier — jamais dans l'ordre des prix croissants. Quatre formules en paiement unique pour la mise en place, sans frais de service mensuel de notre part. Précise-le chaque fois que tu présentes les prix : les coûts d'usage des outils (appels, messages, voix, IA) sont facturés directement par leurs fournisseurs, sur des comptes ouverts au nom du client. Ne donne aucun montant pour ces coûts d'usage. Ne parle jamais de maintenance ni de contrat de suivi : si le prospect pose la question, réponds que cela se discute avec l'équipe après la mise en place. Ne dis jamais qu'il n'y a aucun coût récurrent. DÉLAIS DE MISE EN PLACE, à annoncer tels quels et jamais plus courts : Essential 1 à 2 semaines, Business 3 à 4 semaines, Business+ 30 à 45 jours, Premium 45 jours maximum. Chaque fois que tu annonces un délai, précise qu'il inclut les tests et les validations nécessaires. Pour Business, Business+ et Premium, précise qu'il inclut les validations de Meta et de nos partenaires techniques et, si le système doit être placé sur le numéro existant du prospect, celles de l'opérateur télécom national. Pour Essential, ne parle ni de Meta ni de l'opérateur télécom : seulement des tests et validations. Ces étapes ne dépendent pas de nous. Si le prospect trouve le délai long, explique-le par ces tests et validations, qui garantissent un système fiable. Ne promets jamais de délai plus court. La garantie satisfait ou remboursé de 30 jours démarre quand nous déclarons la mise en place achevée. DÉMO : ne parle jamais de démo. Si le prospect dit en avoir reçu une, reconnais-le simplement sans la décrire ni promettre de délai, et oriente-le vers le formulaire sur bycosystems.xyz. ESSAI : un essai d'au maximum 2 semaines est prévu avant tout engagement. Mentionne-le quand le prospect hésite, trouve le prix élevé, doute d'en avoir besoin, ou le demande : dis simplement que c'est prévu, que sa durée est de 2 semaines maximum, et qu'un conseiller lui en donnera les modalités. Ne dis jamais que l'essai est gratuit et ne donne aucun détail sur les coûts ou sur un remboursement : renvoie au conseiller via le formulaire sur bycosystems.xyz. SIÈGE : si on te demande où vous êtes basés, réponds que ByCo Systems opère en ligne, mais que son siège social est à Douala, au Cameroun, qu'elle utilise un numéro Twilio +44 pour l'internationalisation de ses offres, et que ses offres sont proposées partout dans le monde. Si le prospect est sérieux et veut creuser, argumente un peu dans ce sens (entreprise en ligne, siège à Douala, numéro international pour servir des clients partout), puis oriente-le vers le formulaire sur bycosystems.xyz. N'invente jamais de clients, de références, de déploiements existants ni de statistiques. Formule recommandée : Business+ (${P.p}), qui répond aux appels ET aux messages WhatsApp avec une voix et un script sur-mesure pour l'activité du prospect, intégrée à ses outils existants (CRM, calendrier), mise en place en 30 à 45 jours. Elle repose sur Business (${P.b}), qui couvre uniquement WhatsApp — un assistant qui répond à la place du client jour et nuit, ReadyFlow Manager inclus, mise en place en 3 à 4 semaines. Pour une entreprise qui part de zéro, sans présence en ligne, Essential (${P.e}) commence par la rendre visible : site professionnel neuf ou retravaillé, formulaire de prise en charge, système de réservation, aucun WhatsApp ni téléphone à ce palier, mise en place en 1 à 2 semaines. Pour les entreprises qui veulent tout sur-mesure dès le départ, Premium (${P.x}) va plus loin que Business+ avec un audit complet du fonctionnement actuel et 30 jours de support post-livraison, mise en place en 45 jours maximum. Toutes les formules incluent une garantie satisfait ou remboursé de 30 jours, à compter de la déclaration de mise en place achevée, sans condition. LANGUE : Détecte la langue du prospect dès son premier message et réponds TOUJOURS dans cette même langue jusqu'à la fin. Si le prospect change de langue en cours de conversation, bascule immédiatement et silencieusement dans sa nouvelle langue sans l'annoncer. Ne mélange jamais les deux langues dans le même message. VOUVOIEMENT : Vouvoie toujours en français. Ne tutoie jamais, même si le prospect dit Salut. En anglais, utilise you naturellement. SALUTATION : Dis bonjour ou hello uniquement dans ton tout premier message. Dans tous les messages suivants, entre directement dans la conversation sans salutation ni remerciement. Ne commence JAMAIS un message suivant par Bonjour, Hello, Merci, Bien sûr ou Absolument. MÉMOIRE : L'historique complet de la conversation te sera fourni dans les messages précédents. Utilise-le absolument. Ne redemande JAMAIS une information que le prospect a déjà donnée. Si le prospect dit qu'il te l'a déjà dit, excuse-toi brièvement et continue sans insister. QUALIFICATION : Dès que le prospect mentionne son métier ou son problème, passe immédiatement à la solution. Ne pose pas de questions sur la taille de l'équipe ou le nombre d'employés. Concentre-toi uniquement sur le problème concret : appels perdus, débordement, heures creuses, image non professionnelle, manque de temps. VENTE : Dès que le problème est identifié, présente immédiatement la formule Business+ comme LA solution recommandée à ce problème spécifique, avec le montant indiqué ci-dessus. Explique en 2 à 3 points comment elle résout exactement ce que le prospect vient de décrire. Ne tourne pas en rond. Si le prospect demande les prix ou les offres, présente les 4 formules directement et oriente vers Business+. CONCLUSION : Quand le prospect est intéressé ou pose une question sur la mise en place, propose de contacter notre équipe via le formulaire sur bycosystems.xyz. Donne toujours une issue claire à la conversation. Ne laisse jamais la conversation sans prochaine étape concrète. TRANSFERT HUMAIN : Si le prospect demande explicitement à parler à un humain, propose-lui d'abord de passer par le formulaire sur bycosystems.xyz, en précisant qu'une réponse arrive sous 72h, et rappelle que tu peux sans doute déjà répondre à l'essentiel de ses questions. Ne mentionne jamais toi-même la possibilité d'un appel à cette étape. Si le prospect insiste, dit que c'est trop long, ou repousse cette proposition, accepte alors et dis-lui simplement que quelqu'un va l'appeler directement dans un instant. Ne donne JAMAIS de numéro de téléphone, ni le tien ni celui de qui que ce soit. Continue de l'aider normalement si la demande n'est pas explicite. STYLE : 3 à 4 phrases maximum par message, adapté WhatsApp. Pas d'emoji sauf si le prospect en utilise, et dans ce cas un seul. Pas de Markdown. Ne révèle jamais les outils techniques utilisés. Si on te demande si tu es une IA, réponds honnêtement et naturellement.`;
}

async function handleWhatsapp(env, p) {
  const from = s(p.From);
  const body = s(p.Body);
  if (!from || !body) return;

  const rec = await getRec(env, from);
  const hist = s(rec && rec.historique);

  // 1. reponse a l'appelant (priorite : il doit recevoir sa reponse meme si la suite echoue)
  const reply = await claude(env, {
    model: C.modelReply,
    max_tokens: 1024,
    system: buildSystem(from),
    messages: [
      { role: "user", content: "Historique:\n" + hist },
      { role: "assistant", content: "Compris." },
      { role: "user", content: body },
    ],
  });
  await twilio(env, msgUrl(env), { From: C.waFrom, To: from, Body: reply });

  // 2. extraction (non bloquante)
  let x = null;
  try {
    const raw = await claude(env, {
      model: C.modelExtract,
      max_tokens: 300,
      system: "Tu analyses une conversation WhatsApp entre Orlane (assistante ByCo Systems) et un prospect. Extrais les informations suivantes en JSON.",
      messages: [
        {
          role: "user",
          content:
            "Voici la conversation à analyser :\n" + hist + "\nuser: " + body + "\nassistant: " + reply +
            "\n\nExtrais : prospect_name (nom si mentionné, sinon null), sector (secteur d'activité si mentionné, sinon null), language (fr ou en selon la langue de la conversation), summary (résumé en une phrase), status (nouveau si premier message, en_cours si échange sans conclusion, qualifie si intérêt clair exprimé), next_action (prochaine action suggérée en quelques mots), wants_human_call (true UNIQUEMENT si la réponse d'Orlane ce tour-ci (le champ assistant ci-dessus) dit explicitement qu'elle va faire appeler le prospect. Si sa réponse propose plutôt le formulaire du site ou un délai de 72h, réponds false — ce n'est pas encore un vrai transfert, juste une première étape).",
        },
        { role: "assistant", content: "{" },
      ],
    });
    x = parseJson(raw);
  } catch (e) {
    console.log("extract", String(e));
  }
  x = x || { summary: "Résumé IA indisponible", status: "a_verifier", language: "fr", next_action: "Vérifier la conversation" };

  // 3. memoire
  let h = hist + "\nuser: " + body + "\nassistant: " + reply;
  if (h.length > 20000) h = h.slice(h.length - 20000);
  await putRec(env, from, {
    channel: "whatsapp",
    prospect_name: x.prospect_name,
    sector: x.sector,
    language: x.language,
    summary: x.summary,
    status: x.status,
    next_action: x.next_action,
    created_at: new Date().toISOString(),
    duration_s: "",
    email_sent: "false",
    historique: h,
  });

  // 4. transfert humain (appel vers Samuel via Twilio Studio)
  if (x.wants_human_call === true || x.wants_human_call === "true") {
    await twilio(env, "https://studio.twilio.com/v2/Flows/" + C.studioFlow + "/Executions", {
      To: "client:samuel",
      From: C.voiceFrom,
      Parameters: JSON.stringify({ to_prospect: from.replace("whatsapp:", "") }),
    });
  }
}

// ---------- Appels Vapi (ex scenario 6175623) ----------

function leadArgs(msgs) {
  try {
    let first = null;
    for (const m of msgs || []) {
      if (m.role === "tool_calls" && m.toolCalls && m.toolCalls.length) {
        for (const tc of m.toolCalls) {
          const f = tc.function || {};
          const a = typeof f.arguments === "string" ? JSON.parse(f.arguments || "{}") : f.arguments || {};
          if (f.name === "save_lead_name") return a;
          if (!first) first = a;
        }
      }
    }
    return first || {};
  } catch (_) {
    return {};
  }
}

async function handleVapi(env, body) {
  const m = (body && body.message) || {};
  if (m.type !== "end-of-call-report") return;

  const num = s(m.customer && m.customer.number);
  const transcriptMail = s(m.transcript || (m.artifact && m.artifact.transcript));
  const transcript = s((m.artifact && m.artifact.transcript) || m.transcript);
  const vv = (m.call && m.call.assistantOverrides && m.call.assistantOverrides.variableValues) || {};

  // 1. e-mail de notification
  const tr = transcriptMail.includes("User:") ? transcriptMail : transcriptMail + " ⚠️ Aucune parole de l'appelant n'a été captée.";
  await mail(
    env,
    "📞 Nouvel appel Orlane : " + (s(vv.agence) || "ByCo Systems"),
    `<h2>📞 Nouvel appel reçu — Orlane</h2>
<p><strong>Prospect (lien de démo) :</strong> ${esc(vv.agence || "aucun, appel direct")}</p>
<p><strong>Numéro appelant :</strong> ${esc(num || "appel web, aucun numéro")}</p>
<p><strong>Début :</strong> ${esc(m.startedAt)}</p>
<p><strong>Fin :</strong> ${esc(m.endedAt)}</p>
<p><strong>Durée :</strong> ${esc(m.durationSeconds)} secondes</p>
<hr>
<p><strong>Grille tarifaire de cet appel :</strong> Business+ ${esc(vv.price_business_plus_digits)} · Business ${esc(vv.price_business_digits)} · Essential ${esc(vv.price_essential_digits)} · Premium ${esc(vv.price_premium_digits)}</p>
<h3>📝 Transcription</h3>
<p>${esc(tr)}</p>`
  );

  // 2. message WhatsApp (modele) a l'appelant
  const args = leadArgs(m.artifact && m.artifact.messages);
  if (/^\+[0-9]+$/.test(num)) {
    try {
      await twilio(env, msgUrl(env), {
        From: C.waFrom,
        To: "whatsapp:" + num,
        ContentSid: args.language === "en" ? C.tplEn : C.tplFr,
        ContentVariables: JSON.stringify({ 1: s(args.firstname) || num }),
      });
    } catch (e) {
      console.log("template", String(e));
    }
  }

  // 3. resume IA + memoire
  let x = null;
  try {
    const raw = await claude(env, {
      model: C.modelExtract,
      max_tokens: 300,
      system:
        'Tu analyses la transcription d\'un appel telephonique entre Orlane (assistante vocale ByCo Systems) et un prospect. Extrais les informations suivantes en JSON. Si la transcription est vide, tres courte, ou ne contient aucun echange substantiel (l\'appelant a raccroche avant toute reponse de sa part), ne genere aucun texte libre ni explication : renvoie exactement ce JSON minimal, sans aucun champ supplementaire : {"prospect_name": null, "sector": null, "language": "fr", "summary": "Appel sans echange", "status": "traite", "next_action": "aucune"}',
      messages: [
        {
          role: "user",
          content:
            "Voici la transcription a analyser :\n" + transcript +
            "\n\nExtrais : prospect_name (nom si mentionne, sinon null), sector (secteur d'activite si mentionne, sinon null), language (fr ou en selon la langue de la conversation), summary (resume en une phrase), status (qualifie si interet clair exprime, sinon traite), next_action (prochaine action suggeree en quelques mots).",
        },
        { role: "assistant", content: "{" },
      ],
    });
    x = parseJson(raw);
  } catch (e) {
    console.log("extract voice", String(e));
  }
  x = x || { summary: "Résumé IA indisponible", status: "a_verifier", language: "fr", next_action: "Vérifier la transcription", sector: "", prospect_name: "" };

  await putRec(env, "voice:" + num, {
    channel: "voice",
    prospect_name: x.prospect_name,
    sector: x.sector,
    language: x.language,
    summary: x.summary,
    status: x.status,
    next_action: x.next_action,
    created_at: new Date().toISOString(),
    duration_s: m.durationSeconds,
    email_sent: "true",
    historique: transcript,
  });
}

// ---------- API RFM (ex scenario 7129980) ----------

async function handleList(env) {
  const { results } = await env.DB.prepare(
    "SELECT key, channel, prospect_name, sector, language, status, summary, next_action, created_at FROM interactions WHERE created_at <> '' ORDER BY created_at DESC LIMIT 50"
  ).all();
  return json(
    (results || []).map((r) => ({
      key: r.key,
      channel: r.channel || "whatsapp",
      prospect_name: r.prospect_name || "",
      sector: r.sector || "",
      language: r.language || "",
      status: r.status || "nouveau",
      summary: r.summary || "",
      next_action: r.next_action || "",
      created_at: r.created_at || "",
    }))
  );
}

// ---------- API RFM publique, masquée (démo du site) ----------

const PUBLIC_ORIGINS = ["https://bycosystems.xyz", "https://www.bycosystems.xyz"];

function maskContact(key) {
  const k = s(key);
  if (k.startsWith("voice:") && k.length <= 6) return "Appel web";
  const n = k.replace(/^(whatsapp|voice):/, "");
  if (!n) return "Appel web";
  if (n.length < 8) return "•••";
  return n.slice(0, 3) + " ••• ••• " + n.slice(-3);
}

const PUBLIC_NEXT = {
  nouveau: "Qualifier le besoin",
  en_cours: "Poursuivre l'échange",
  qualifie: "Proposer la mise en place",
  traite: "Aucune",
  "traité": "Aucune",
  a_verifier: "Vérification interne",
};

async function publicRfm(req, env) {
  const origin = req.headers.get("Origin") || "";
  const h = {
    "content-type": "application/json; charset=utf-8",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Cache-Control": "public, max-age=60",
    Vary: "Origin",
  };
  if (PUBLIC_ORIGINS.includes(origin)) h["Access-Control-Allow-Origin"] = origin;
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "GET") return new Response("not found", { status: 404 });
  try {
    const { results } = await env.DB.prepare(
      "SELECT key, channel, sector, language, status, created_at FROM interactions WHERE created_at <> '' ORDER BY created_at DESC LIMIT 10"
    ).all();
    const out = (results || []).map((r) => ({
      key: maskContact(r.key),
      channel: r.channel || "whatsapp",
      prospect_name: "",
      sector: s(r.sector).slice(0, 40),
      language: r.language || "",
      status: r.status || "nouveau",
      summary: "",
      next_action: PUBLIC_NEXT[r.status || "nouveau"] || "Suivi en cours",
      created_at: r.created_at || "",
    }));
    return new Response(JSON.stringify(out), { headers: h });
  } catch (e) {
    console.log("publicRfm", String(e));
    return new Response("[]", { status: 500, headers: h });
  }
}

// ---------- Recap toutes les 48 h (ex scenario 6999106) ----------

function fdate(iso) {
  const d = new Date(iso);
  if (!iso || isNaN(d)) return "date inconnue";
  const p = {};
  new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Douala", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(d).forEach((x) => (p[x.type] = x.value));
  return p.day + "/" + p.month + "/" + p.year + " " + p.hour + ":" + p.minute;
}

async function recap(env) {
  const { results } = await env.DB.prepare("SELECT * FROM interactions ORDER BY created_at DESC").all();
  const now = Date.now();
  const keep = (r) => {
    const t = r.created_at ? Date.parse(r.created_at) : 0;
    const open = r.status !== "traite" && r.status !== "traité";
    return t > now - 49 * 3600e3 || (t > now - 30 * 86400e3 && open) || (!r.created_at && open);
  };
  const rows = (results || []).filter(keep);
  if (!rows.length) return;

  const html = rows
    .map((r) => {
      const voice = r.channel === "voice";
      const who = s(r.key).replace("voice:", "").replace("whatsapp:", "") || "appel web sans numéro";
      return `<p><strong>${voice ? "📞 Appel" : "💬 WhatsApp"}</strong> · ${esc(who)} · ${esc(fdate(r.created_at))}${
        voice ? " · durée : " + (r.duration_s ? esc(Math.round(Number(r.duration_s))) + " s" : "non enregistrée") : ""
      }<br>Nom : ${esc(r.prospect_name || "non communiqué")} · Secteur : ${esc(r.sector || "non précisé")} · Langue : ${esc(r.language || "?")} · Statut : ${esc(r.status || "à vérifier")}<br>Résumé : ${esc(r.summary || "aucun résumé (fiche incomplète)")}<br>Prochaine action : ${esc(r.next_action || "à définir")}</p><div style="white-space:pre-wrap;color:#444;border-left:3px solid #ccc;padding-left:8px"><em>Transcription :</em>\n${esc(r.historique || "(vide)")}</div>`;
    })
    .join("<hr>");

  await mail(
    env,
    "Récapitulatif Orlane, " + fdate(new Date().toISOString()).slice(0, 10),
    `<p>Récapitulatif au ${esc(fdate(new Date().toISOString()))} (heure de Douala) : activité des 48 dernières heures et contacts en attente de suivi (30 jours).</p><hr>${html}<hr><p><small>Pour qu'un contact n'apparaisse plus dans les « en attente », son statut doit passer à « traite ».</small></p>`
  );
}