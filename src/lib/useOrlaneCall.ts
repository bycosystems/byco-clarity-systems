// Appel WebRTC vers Orlane via le Vapi Web SDK, en remplacement du lien
// tel: sur les pages démo. Charge le SDK au clic seulement (pas au chargement
// de la page) pour ne rien alourdir tant que le visiteur n'a pas interagi.

import { useCallback, useRef, useState } from "react";
import type { Marche } from "./pricing";

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
  const vapiRef = useRef<InstanceType<typeof import("@vapi-ai/web").default> | null>(null);

  const start = useCallback(async () => {
    if (!VAPI_PUBLIC_KEY) {
      console.error("VITE_VAPI_PUBLIC_KEY manquante — bouton d'appel désactivé.");
      setStatus("error");
      return;
    }
    if (vapiRef.current) return; // déjà démarré
    setStatus("connecting");
    try {
      const { default: Vapi } = await import("@vapi-ai/web");
      const vapi = new Vapi(VAPI_PUBLIC_KEY);
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
      await vapi.start(ORLANE_ASSISTANT_ID, {
        variableValues: { marche },
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
