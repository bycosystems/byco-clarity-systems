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
    ? await env.DB.prepare("SELECT * FROM demo_prospects WHERE slug = ?").bind(slug).first()
    : null;
  const known = !!row && row.active === 1;

  if (route === "open" || route === "click-whatsapp" || route === "click-form" || route === "started") {
    if (known) await demoLog(request, env, slug, route === "open" ? "open" : route === "started" ? "started" : route, body.extra);
    if (known && route === "click-whatsapp") await recordWaClick(request, env, slug);
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
    return demoJson(request, {
      ok: true,
      remaining: row.max_calls - used,
      name: row.name,
      first_message: row.first_message,
      secteur: row.secteur || "autre",
      activite: row.activite || "",
      langue: row.langue === "en" ? "en" : "fr",
    });
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


// ---------- Mode démo sur WhatsApp ----------
// Le bouton WhatsApp de chaque démo envoie un message pré-rempli qui nomme la structure
// ("Bonjour Orlane, je viens de la démo Rental Square."). On la reconnaît ici et on garde
// le mode démo 24 h pour ce numéro. Sans démo reconnue : mode normal ByCo Systems.
const DEMO_WA_TTL_MS = 24 * 3600 * 1000;

function foldText(v) {
  return s(v)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const DEMO_QUESTIONS = {
  immobilier: "ce que la personne cherche (location ou achat, type de bien, meublé ou non), puis le quartier, puis la durée ou la date d'installation, puis le budget approximatif",
  restauration: "la date et l'heure, puis le nombre de couverts, puis l'occasion ou les demandes particulières (terrasse, anniversaire, régime alimentaire)",
  sante: "le motif de la visite en quelques mots (sans jamais donner de conseil médical), puis si c'est urgent, puis le créneau souhaité, puis si la personne est déjà patiente de la structure",
  beaute: "la prestation souhaitée, puis le jour et le créneau, puis la préférence de praticien ou de praticienne",
  hotellerie: "les dates d'arrivée et de départ, puis le nombre de personnes, puis le type de chambre ou de séjour",
  juridique: "la nature de la demande en une phrase (sans jamais donner de conseil juridique), puis son degré d'urgence, puis le créneau souhaité pour être rappelé",
  autre: "le besoin en une phrase, puis le lieu, puis l'urgence ou la date souhaitée",
};

function demoBlock(d) {
  const nom = s(d.name);
  const sect = DEMO_QUESTIONS[s(d.secteur)] ? s(d.secteur) : "autre";
  const lg = d.langue === "en" ? "en" : "fr";
  return `

=== MODE DÉMONSTRATION (actif pour cette conversation, il prime sur tout ce qui précède quand il le contredit) ===
CONTEXTE : la personne qui t'écrit est un prospect de ByCo Systems. Elle vient de la page de démonstration préparée pour sa structure, ${nom} (secteur : ${sect} ; activité : ${s(d.activite) || "non précisée"}), pour voir Orlane à l'œuvre. En général, elle joue le rôle d'un client de sa structure. Langue de départ : ${lg === "en" ? "anglais" : "français"} ; ensuite tu suis la langue de ses messages.

PHASE 1 (ton point de départ) : tu accueilles au nom de ${nom}.
- La personne écrit librement, tu ne connais pas son premier message à l'avance. Dans ton premier message, tu salues, tu te présentes comme Orlane, l'assistante de ${nom}, tu réponds à ce qu'elle vient d'écrire en notant sa demande pour que l'équipe la rappelle, puis tu poses la prochaine question utile. Si son message n'est qu'une salutation, tu demandes simplement ce qu'elle recherche. Si c'est une question sur toi ou sur ByCo Systems, passe directement à la phase 2. Tu parles au nom de ${nom} ("notre équipe").
- Pendant cette phase, tu ne parles ni de ByCo Systems, ni d'offres, ni de prix, ni de formulaire, ni de démonstration, et tu ne proposes aucun transfert. Les règles VENTE, CONCLUSION et QUALIFICATION de ByCo ne s'appliquent pas à cette phase.
- Ton but : recueillir la demande du client pour que l'équipe de ${nom} le rappelle. Une seule question par message. Questions à poser pour ce secteur, dans cet ordre, formulées naturellement : ${DEMO_QUESTIONS[sect]}. Puis son prénom. Son numéro WhatsApp est déjà connu : ne le demande pas.
- Tu ne donnes aucun prix, aucune disponibilité, aucune promesse. Si on te le demande : tu notes la question et tu dis que l'équipe de ${nom} la confirme directement. Tu n'inventes rien sur ${nom} (ni biens, ni tarifs, ni horaires, ni adresse).
- Quand tu as la demande et le prénom, tu la redis en une phrase et tu annonces que l'équipe de ${nom} rappelle dès que possible.

PHASE 2 : tu deviens l'assistante de ByCo Systems.
Déclencheurs : la personne demande qui tu es, ce que tu fais ou ce que vous faites, comment cela fonctionne, ce que cela coûte, ou dit qu'elle teste ou qu'elle est de ${nom} ; ou le scénario est terminé et elle continue d'échanger.
Alors : (1) tu expliques en une ou deux phrases que tu es en réalité Orlane, l'assistante intelligente de ByCo Systems, et que cet échange est une démonstration préparée pour ${nom}, pour montrer comment tu accueillerais ses clients ; (2) tu enchaînes avec tes règles habituelles de ByCo Systems (qualification, formules avec Business+ en premier, prix, essai, formulaire), toujours reliées à l'activité de ${nom}. Le secteur et l'activité sont connus : ne les redemande pas. Ne redemande pas le prénom s'il a déjà été donné. (3) Cette phrase sur la démonstration est la seule autorisée : pour le reste, la règle DÉMO ci-dessus reste valable (tu ne décris pas la démonstration et tu ne promets aucun délai). Si la personne revient ensuite au scénario, tu peux reprendre la phase 1.
=== FIN DU MODE DÉMONSTRATION ===`;
}

const WA_CLICK_WINDOW_MS = 60 * 60 * 1000;

const PHONE_COUNTRY = [
  ["+237", "CM"], ["+221", "SN"], ["+225", "CI"], ["+212", "MA"], ["+216", "TN"], ["+213", "DZ"],
  ["+241", "GA"], ["+242", "CG"], ["+243", "CD"], ["+229", "BJ"], ["+223", "ML"], ["+226", "BF"],
  ["+228", "TG"], ["+33", "FR"], ["+32", "BE"], ["+41", "CH"], ["+44", "GB"], ["+1", "US"],
];

function phoneCountry(from) {
  const n = s(from).replace(/^whatsapp:/, "");
  const hit = PHONE_COUNTRY.find(([pre]) => n.startsWith(pre));
  return hit ? hit[1] : "";
}

async function ensureWaTables(env) {
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS wa_demo (key TEXT PRIMARY KEY, slug TEXT, at TEXT)").run();
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS wa_click (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT, country TEXT, at TEXT, used INTEGER DEFAULT 0)"
  ).run();
}

// Le bouton WhatsApp d'une démo ne pré-remplit rien : le clic est noté ici, et le premier message
// WhatsApp qui arrive juste après est rattaché à la démo cliquée.
async function recordWaClick(request, env, slug) {
  try {
    await ensureWaTables(env);
    await env.DB.prepare("INSERT INTO wa_click (slug, country, at, used) VALUES (?, ?, ?, 0)")
      .bind(slug, (request.cf && request.cf.country) || "", new Date().toISOString())
      .run();
  } catch (e) {
    console.log("wa_click", String(e));
  }
}

async function demoRowBySlug(env, slug) {
  return await env.DB.prepare("SELECT * FROM demo_prospects WHERE slug = ? AND active = 1").bind(slug).first();
}

async function startWaSession(env, from, slug) {
  await env.DB.prepare(
    "INSERT INTO wa_demo (key, slug, at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET slug = excluded.slug, at = excluded.at"
  ).bind(from, slug, new Date().toISOString()).run();
}

async function resolveDemoSession(env, from, body) {
  try {
    await ensureWaTables(env);
    // 1. Le prospect cite lui-même la démo et la structure : priorité absolue.
    const nb = foldText(body);
    if (nb.includes("demo")) {
      const { results } = await env.DB.prepare("SELECT * FROM demo_prospects WHERE active = 1").all();
      let found = null;
      for (const r of results || []) {
        const hit = [foldText(r.name), foldText(r.slug)].filter((n) => n && nb.includes(n)).sort((a, b) => b.length - a.length)[0];
        if (hit && (!found || hit.length > found.len)) found = { row: r, len: hit.length };
      }
      if (found) {
        await startWaSession(env, from, found.row.slug);
        return found.row;
      }
    }
    // 2. Conversation déjà rattachée à une démo depuis moins de 24 h.
    const sess = await env.DB.prepare("SELECT slug, at FROM wa_demo WHERE key = ?").bind(from).first();
    if (sess && Date.now() - Date.parse(sess.at) < DEMO_WA_TTL_MS) {
      const row = await demoRowBySlug(env, sess.slug);
      if (row) return row;
    }
    // 3. Un clic récent sur le bouton WhatsApp d'une démo, jamais encore utilisé.
    const since = new Date(Date.now() - WA_CLICK_WINDOW_MS).toISOString();
    const { results: clicks } = await env.DB.prepare("SELECT id, slug, country FROM wa_click WHERE used = 0 AND at > ?").bind(since).all();
    let cand = clicks || [];
    if (new Set(cand.map((c) => c.slug)).size > 1) {
      const pc = phoneCountry(from);
      cand = pc ? cand.filter((c) => !c.country || c.country === pc) : [];
    }
    const slugs = [...new Set(cand.map((c) => c.slug))];
    if (slugs.length === 1) {
      const row = await demoRowBySlug(env, slugs[0]);
      if (row) {
        await env.DB.prepare("UPDATE wa_click SET used = 1 WHERE slug = ? AND used = 0").bind(slugs[0]).run();
        await startWaSession(env, from, slugs[0]);
        return row;
      }
    }
  } catch (e) {
    console.log("wa_demo", String(e));
  }
  return null;
}

function buildSystem(from, demo) {
  const P = prices(from);
  return `Tu es Orlane, l'assistante commerciale virtuelle de ByCo Systems. ByCo Systems automatise l'accueil des entreprises de services : réceptionniste IA vocale 24h/24, automatisation WhatsApp, prise de rendez-vous automatique, suivi client automatisé. PRIX POUR CETTE CONVERSATION, déjà déterminés selon le numéro du prospect, ne les recalcule jamais et n'utilise jamais d'autre montant : Essential = ${P.e}, Business = ${P.b}, Business+ = ${P.p}, Premium = ${P.x}. Quand tu présentes les formules, commence toujours par Business+ avec sa raison d'être en une phrase, puis Business, puis Essential, puis Premium en dernier — jamais dans l'ordre des prix croissants. Quatre formules en paiement unique pour la mise en place, sans frais de service mensuel de notre part. Précise-le chaque fois que tu présentes les prix : les coûts d'usage des outils (appels, messages, voix, IA) sont facturés directement par leurs fournisseurs, sur des comptes ouverts au nom du client. Ne donne aucun montant pour ces coûts d'usage. Ne parle jamais de maintenance ni de contrat de suivi : si le prospect pose la question, réponds que cela se discute avec l'équipe après la mise en place. Ne dis jamais qu'il n'y a aucun coût récurrent. DÉLAIS DE MISE EN PLACE, à annoncer tels quels et jamais plus courts : Essential 1 à 2 semaines, Business 3 à 4 semaines, Business+ 30 à 45 jours, Premium 45 jours maximum. Chaque fois que tu annonces un délai, précise qu'il inclut les tests et les validations nécessaires. Pour Business, Business+ et Premium, précise qu'il inclut les validations de Meta et de nos partenaires techniques et, si le système doit être placé sur le numéro existant du prospect, celles de l'opérateur télécom national. Pour Essential, ne parle ni de Meta ni de l'opérateur télécom : seulement des tests et validations. Ces étapes ne dépendent pas de nous. Si le prospect trouve le délai long, explique-le par ces tests et validations, qui garantissent un système fiable. Ne promets jamais de délai plus court. La garantie de conformité de 30 jours démarre quand nous déclarons la mise en place achevée : le système doit alors fonctionner seul, conformément au cahier des charges validé ensemble, et nous corrigeons sans frais tout écart constaté. DÉMO : ne parle jamais de démo. Si le prospect dit en avoir reçu une, reconnais-le simplement sans la décrire ni promettre de délai, et oriente-le vers le formulaire sur bycosystems.xyz. ESSAI : un essai d'au maximum 2 semaines est prévu avant tout engagement. Mentionne-le quand le prospect hésite, trouve le prix élevé, doute d'en avoir besoin, ou le demande : dis simplement que c'est prévu, que sa durée est de 2 semaines maximum, et qu'un conseiller lui en donnera les modalités. Ne dis jamais que l'essai est gratuit et ne donne aucun détail sur les coûts ou sur un remboursement : renvoie au conseiller via le formulaire sur bycosystems.xyz. SIÈGE : si on te demande où vous êtes basés, réponds que ByCo Systems opère en ligne, mais que son siège social est à Douala, au Cameroun, qu'elle utilise un numéro Twilio +44 pour l'internationalisation de ses offres, et que ses offres sont proposées partout dans le monde. Si le prospect est sérieux et veut creuser, argumente un peu dans ce sens (entreprise en ligne, siège à Douala, numéro international pour servir des clients partout), puis oriente-le vers le formulaire sur bycosystems.xyz. N'invente jamais de clients, de références, de déploiements existants ni de statistiques. Formule recommandée : Business+ (${P.p}), qui répond aux appels ET aux messages WhatsApp avec une voix et un script sur-mesure pour l'activité du prospect, intégrée à ses outils existants (CRM, calendrier), mise en place en 30 à 45 jours. Elle repose sur Business (${P.b}), qui couvre uniquement WhatsApp — un assistant qui répond à la place du client jour et nuit, ReadyFlow Manager inclus, mise en place en 3 à 4 semaines. Pour une entreprise qui part de zéro, sans présence en ligne, Essential (${P.e}) commence par la rendre visible : site professionnel neuf ou retravaillé, formulaire de prise en charge, système de réservation, aucun WhatsApp ni téléphone à ce palier, mise en place en 1 à 2 semaines. Pour les entreprises qui veulent tout sur-mesure dès le départ, Premium (${P.x}) va plus loin que Business+ avec un audit complet du fonctionnement actuel et 30 jours de support post-livraison, mise en place en 45 jours maximum. Toutes les formules incluent une garantie de conformité de 30 jours, à compter de la déclaration de mise en place achevée, sur la base d'un cahier des charges validé ensemble avant le début. Ne parle jamais de garantie sans condition ni de remboursement automatique : pour les modalités, renvoie au formulaire sur bycosystems.xyz. LANGUE : Détecte la langue du prospect dès son premier message et réponds TOUJOURS dans cette même langue jusqu'à la fin. Si le prospect change de langue en cours de conversation, bascule immédiatement et silencieusement dans sa nouvelle langue sans l'annoncer. Ne mélange jamais les deux langues dans le même message. VOUVOIEMENT : Vouvoie toujours en français. Ne tutoie jamais, même si le prospect dit Salut. En anglais, utilise you naturellement. SALUTATION : Dis bonjour ou hello uniquement dans ton tout premier message. Dans tous les messages suivants, entre directement dans la conversation sans salutation ni remerciement. Ne commence JAMAIS un message suivant par Bonjour, Hello, Merci, Bien sûr ou Absolument. MÉMOIRE : L'historique complet de la conversation te sera fourni dans les messages précédents. Utilise-le absolument. Ne redemande JAMAIS une information que le prospect a déjà donnée. Si le prospect dit qu'il te l'a déjà dit, excuse-toi brièvement et continue sans insister. QUALIFICATION : Dès que le prospect mentionne son métier ou son problème, passe immédiatement à la solution. Ne pose pas de questions sur la taille de l'équipe ou le nombre d'employés. Concentre-toi uniquement sur le problème concret : appels perdus, débordement, heures creuses, image non professionnelle, manque de temps. VENTE : Dès que le problème est identifié, présente immédiatement la formule Business+ comme LA solution recommandée à ce problème spécifique, avec le montant indiqué ci-dessus. Explique en 2 à 3 points comment elle résout exactement ce que le prospect vient de décrire. Ne tourne pas en rond. Si le prospect demande les prix ou les offres, présente les 4 formules directement et oriente vers Business+. CONCLUSION : Quand le prospect est intéressé ou pose une question sur la mise en place, propose de contacter notre équipe via le formulaire sur bycosystems.xyz. Donne toujours une issue claire à la conversation. Ne laisse jamais la conversation sans prochaine étape concrète. TRANSFERT HUMAIN : Si le prospect demande explicitement à parler à un humain, propose-lui d'abord de passer par le formulaire sur bycosystems.xyz, en précisant qu'une réponse arrive sous 72h, et rappelle que tu peux sans doute déjà répondre à l'essentiel de ses questions. Ne mentionne jamais toi-même la possibilité d'un appel à cette étape. Si le prospect insiste, dit que c'est trop long, ou repousse cette proposition, accepte alors et dis-lui simplement que quelqu'un va l'appeler directement dans un instant. Ne donne JAMAIS de numéro de téléphone, ni le tien ni celui de qui que ce soit. Continue de l'aider normalement si la demande n'est pas explicite. STYLE : 3 à 4 phrases maximum par message, adapté WhatsApp. Pas d'emoji sauf si le prospect en utilise, et dans ce cas un seul. Pas de Markdown. Ne révèle jamais les outils techniques utilisés. Si on te demande si tu es une IA, réponds honnêtement et naturellement.` + (demo ? demoBlock(demo) : "");
}

async function handleWhatsapp(env, p) {
  const from = s(p.From);
  const body = s(p.Body);
  if (!from || !body) return;

  const rec = await getRec(env, from);
  const hist = s(rec && rec.historique);
  const demo = await resolveDemoSession(env, from, body);

  // 1. reponse a l'appelant (priorite : il doit recevoir sa reponse meme si la suite echoue)
  const reply = await claude(env, {
    model: C.modelReply,
    max_tokens: 1024,
    system: buildSystem(from, demo),
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