// Appel WebRTC vers Orlane via le Vapi Web SDK, en remplacement du lien
// tel: sur les pages démo. Charge le SDK au clic seulement (pas au chargement
// de la page) pour ne rien alourdir tant que le visiteur n'a pas interagi.

import { useCallback, useRef, useState } from "react";
import type { Marche } from "./pricing";
import type Vapi from "../vendor/vapi-bundled.mjs";

// Assistant "Orlane" (Vapi) — id stable, confirmé via dashboard.vapi.ai.
const ORLANE_ASSISTANT_ID = "621b0d76-7aad-483e-89b7-30c0b55415b7";

// Clé PUBLIQUE Vapi (faite pour être exposée côté navigateur, comme une
// clé publiable Stripe) — à fournir dans .env / variables d'environnement
// Cloudflare Pages sous VITE_VAPI_PUBLIC_KEY. Jamais la clé privée ici.
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY as string | undefined;

// Durée maximale d'un appel démo pour le marché afrique_francophone
// (coût par minute plus élevé, à ajuster après un premier test réel).
const AFRIQUE_FRANCOPHONE_MAX_DURATION_SECONDS = 90;

export type OrlaneCallStatus = "idle" | "connecting" | "active" | "ended" | "error";

export function useOrlaneCall(marche: Marche, onCallEnded?: () => void) {
  const [status, setStatus] = useState<OrlaneCallStatus>("idle");
  const vapiRef = useRef<InstanceType<typeof Vapi> | null>(null);

  const start = useCallback(async () => {
    if (!VAPI_PUBLIC_KEY) {
      console.error("VITE_VAPI_PUBLIC_KEY manquante — bouton d'appel désactivé.");
      setStatus("error");
      return;
    }
    if (vapiRef.current) return; // déjà démarré
    setStatus("connecting");
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
      vapi.on("call-start", () => setStatus("active"));
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
        variableValues: {
          marche,
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
        ...(marche === "afrique_francophone"
          ? { maxDurationSeconds: AFRIQUE_FRANCOPHONE_MAX_DURATION_SECONDS }
          : {}),
      });
    } catch (e) {
      console.error("Impossible de démarrer l'appel Orlane :", e);
      setStatus("error");
      vapiRef.current = null;
    }
  }, [marche, onCallEnded]);

  const hangup = useCallback(() => {
    vapiRef.current?.stop();
  }, []);

  return { status, start, hangup };
}
