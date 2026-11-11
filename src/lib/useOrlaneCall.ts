// Appel WebRTC vers Orlane via le Vapi Web SDK, en remplacement du lien
// tel: sur les pages démo. Charge le SDK au clic seulement (pas au chargement
// de la page) pour ne rien alourdir tant que le visiteur n'a pas interagi.
//
// Garde-fou coût (patch 1) : l'appel n'est possible que depuis un lien
// personnalisé `?prospect=` présent dans la liste blanche du Worker
// (orlane-worker, tables D1 demo_prospects / demo_events). Le Worker
// compte les appels réellement démarrés (2 par prospect par défaut).
// Ce sont des limites d'usage, pas une sécurité absolue : la clé publique
// Vapi reste visible côté navigateur (à restreindre dans le tableau de
// bord Vapi : Allowed Origins + Allowed Assistants).

import { useCallback, useRef, useState } from "react";
import type { Marche } from "./pricing";
import type Vapi from "../vendor/vapi-bundled.mjs";

// Assistant "Orlane" (Vapi) — id stable, confirmé via dashboard.vapi.ai.
const ORLANE_ASSISTANT_ID = "621b0d76-7aad-483e-89b7-30c0b55415b7";

// Clé PUBLIQUE Vapi (faite pour être exposée côté navigateur, comme une
// clé publiable Stripe) — à fournir dans .env / variables d'environnement
// Cloudflare Pages sous VITE_VAPI_PUBLIC_KEY. Jamais la clé privée ici.
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY as string | undefined;

// API démo (Worker orlane-worker). Routes publiques, sans clé, CORS limité
// à bycosystems.xyz côté Worker.
const DEMO_API = "https://orlane-worker.contact-byco.workers.dev";

// Durée maximale d'un appel-test depuis un lien prospect autorisé.
// 90 s coupait de vraies conversations en plein milieu de la présentation
// des prix (appel réel de 104 s coupé) ; 240 s couvre les 4 offres.
// Les visiteurs anonymes (appel débloqué après autorisation, patch 2)
// seront plafonnés à 180 s.
export const PROSPECT_CALL_MAX_SECONDS = 240;

export type OrlaneCallStatus = "idle" | "connecting" | "active" | "ended" | "error";

// null : rien à signaler. "limit" : limite d'appels du prospect atteinte.
// "locked" : lien non autorisé (visiteur anonyme ou prospect inconnu).
// "unavailable" : coupe-circuit actif ou Worker injoignable.
export type OrlaneBlock = null | "limit" | "locked" | "unavailable";

type GateAnswer = {
  ok: boolean;
  reason?: "limit" | "unknown" | "unavailable";
  name?: string;
  first_message?: string;
};

// Suivi sans cookie : envoi "beacon" en text/plain (pas de pré-requête CORS),
// sans bloquer la page. Un échec est ignoré.
export function trackDemo(kind: "open" | "click_whatsapp" | "click_form", prospectKey?: string, extra?: string) {
  if (!prospectKey) return;
  try {
    const body = JSON.stringify({ p: prospectKey, extra: extra ?? "" });
    const url = DEMO_API + "/demo/" + kind.replace("_", "-");
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }));
    } else {
      void fetch(url, { method: "POST", body, headers: { "Content-Type": "text/plain" }, keepalive: true });
    }
  } catch {
    /* suivi non critique */
  }
}

async function askGate(prospectKey: string): Promise<GateAnswer | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(DEMO_API + "/demo/gate", {
      method: "POST",
      body: JSON.stringify({ p: prospectKey }),
      headers: { "Content-Type": "text/plain" },
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return (await res.json()) as GateAnswer;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function useOrlaneCall(marche: Marche, onCallEnded?: () => void, prospectKey?: string) {
  const [status, setStatus] = useState<OrlaneCallStatus>("idle");
  const [blocked, setBlocked] = useState<OrlaneBlock>(null);
  const vapiRef = useRef<InstanceType<typeof Vapi> | null>(null);

  const start = useCallback(async () => {
    if (vapiRef.current) return; // déjà démarré
    setBlocked(null);
    // Pas de lien personnalisé : aucun appel, on oriente vers le formulaire.
    if (!prospectKey) {
      setBlocked("locked");
      return;
    }
    if (!VAPI_PUBLIC_KEY) {
      console.error("VITE_VAPI_PUBLIC_KEY manquante — bouton d'appel désactivé.");
      setStatus("error");
      return;
    }
    setStatus("connecting");
    // Le Worker décide : prospect autorisé, limite non atteinte, coupe-circuit.
    // En cas de doute (Worker injoignable), on ne lance PAS l'appel.
    const gate = await askGate(prospectKey);
    if (!gate) {
      setBlocked("unavailable");
      setStatus("idle");
      return;
    }
    if (!gate.ok) {
      setBlocked(gate.reason === "limit" ? "limit" : gate.reason === "unknown" ? "locked" : "unavailable");
      setStatus("idle");
      return;
    }
    try {
      // Import du bundle esbuild pré-empaqueté (src/vendor/vapi-bundled.mjs,
      // généré par scripts/prebundle-vapi.mjs) plutôt que du paquet
      // @vapi-ai/web directement — contourne un bug Rollup/Vite documenté
      // (vitejs/vite#9703 "Inconsistency between dev & build") où le
      // require("events") CJS interne du SDK est traité différemment en
      // dev (fonctionne) et en build (résout vers un stub vide, d'où
      // "Class extends value #<Object> is not a constructor or null").
      const { default: VapiCtor } = await import("../vendor/vapi-bundled.mjs");
      const vapi = new VapiCtor(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;
      vapi.on("call-start", () => {
        setStatus("active");
        // L'appel compte seulement s'il a réellement démarré.
        try {
          navigator.sendBeacon(
            DEMO_API + "/demo/started",
            new Blob([JSON.stringify({ p: prospectKey })], { type: "text/plain" }),
          );
        } catch {
          /* comptage non bloquant */
        }
      });
      vapi.on("call-end", () => {
        setStatus("ended");
        vapiRef.current = null;
        onCallEnded?.();
      });
      vapi.on("error", (e: unknown) => {
        console.error("Erreur appel Orlane :", e);
        setStatus("error");
        vapiRef.current = null;
      });
      // Montants en toutes lettres, un jeu par langue — un format numérique
      // (avec ou sans séparateur) se fait systématiquement mal lire par la
      // synthèse vocale (lecture chiffre par chiffre, ou virgule prise pour
      // un séparateur décimal). Orlane ne lit donc plus jamais un chiffre :
      // le montant à réciter est déjà écrit comme texte.
      const prices =
        marche === "afrique_francophone"
          ? {
              essentialFr: "trois cent quarante-trois mille neuf cents francs CFA",
              essentialEn: "three hundred forty-three thousand nine hundred CFA francs",
              essentialDigits: "343 900 FCFA",
              businessFr: "six cent quatre-vingt-quatorze mille neuf cents francs CFA",
              businessEn: "six hundred ninety-four thousand nine hundred CFA francs",
              businessDigits: "694 900 FCFA",
              businessPlusFr: "un million quarante-cinq mille huit cents francs CFA",
              businessPlusEn: "one million forty-five thousand eight hundred CFA francs",
              businessPlusDigits: "1 045 800 FCFA",
              premiumFr: "un million trois cent quatre-vingt-seize mille sept cents francs CFA",
              premiumEn: "one million three hundred ninety-six thousand seven hundred CFA francs",
              premiumDigits: "1 396 700 FCFA",
            }
          : {
              essentialFr: "quatre cent quatre-vingt-dix euros",
              essentialEn: "four hundred ninety euros",
              essentialDigits: "490 €",
              businessFr: "neuf cent quatre-vingt-dix euros",
              businessEn: "nine hundred ninety euros",
              businessDigits: "990 €",
              businessPlusFr: "mille quatre cent quatre-vingt-dix euros",
              businessPlusEn: "one thousand four hundred ninety euros",
              businessPlusDigits: "1 490 €",
              premiumFr: "mille neuf cent quatre-vingt-dix euros",
              premiumEn: "one thousand nine hundred ninety euros",
              premiumDigits: "1 990 €",
            };
      await vapi.start(ORLANE_ASSISTANT_ID, {
        // Orlane décroche au nom de l'agence (texte fourni par le Worker).
        ...(gate.first_message ? { firstMessage: gate.first_message } : {}),
        variableValues: {
          marche,
          agence: gate.name ?? "",
          price_essential_fr: prices.essentialFr,
          price_essential_en: prices.essentialEn,
          price_essential_digits: prices.essentialDigits,
          price_business_fr: prices.businessFr,
          price_business_en: prices.businessEn,
          price_business_digits: prices.businessDigits,
          price_business_plus_fr: prices.businessPlusFr,
          price_business_plus_en: prices.businessPlusEn,
          price_business_plus_digits: prices.businessPlusDigits,
          price_premium_fr: prices.premiumFr,
          price_premium_en: prices.premiumEn,
          price_premium_digits: prices.premiumDigits,
        },
        maxDurationSeconds: PROSPECT_CALL_MAX_SECONDS,
      });
    } catch (e) {
      console.error("Impossible de démarrer l'appel Orlane :", e);
      setStatus("error");
      vapiRef.current = null;
    }
  }, [marche, onCallEnded, prospectKey]);

  const hangup = useCallback(() => {
    vapiRef.current?.stop();
  }, []);

  return { status, blocked, start, hangup };
}
