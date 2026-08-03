// ─────────────────────────────────────────────────────────────
// src/routes/demo/decouvrir/index.tsx
// Démo générique réutilisable — tout prospect (vétérinaires, dentistes,
// serruriers d'urgence, dépanneurs...), sans reconstruction nominative.
// Conçue par ByCo Systems à partir de la mécanique validée sur la démo
// Cabinet Vétérinaire des Pignes (Dr Arnaud) : appel test réel + récap
// WhatsApp simulé.
//
// DÉPLOIEMENT :
//   1. Placer ce fichier dans  src/routes/demo/decouvrir/index.tsx
//   2. git add . && git commit && git push  → Cloudflare Pages déploie
//   3. URL publique : https://bycosystems.xyz/demo/decouvrir
//
// Paramètre d'URL optionnel `?secteur=` pour adapter le vocabulaire
// sans dupliquer la page :
//   ?secteur=sante    → "patient", "consultation", "rendez-vous"
//   ?secteur=urgence  → "intervention", "sur place", "dépannage"
//   absent / inconnu  → formulation neutre par défaut
//
// Aucun élément nominatif : pas de nom d'entreprise, pas d'adresse,
// pas de photo personnelle, pas de citation d'avis Google spécifique.
//
// Pure front-end, aucune dépendance backend. TanStack Start + React + TS.
// Styles inline pour garantir un rendu identique aux autres démos.
// ─────────────────────────────────────────────────────────────

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/demo/decouvrir/")({
  validateSearch: (search: Record<string, unknown>): { secteur?: string } => ({
    secteur: typeof search.secteur === "string" ? search.secteur : undefined,
  }),
  component: DecouvrirDemo,
  head: () => ({
    meta: [
      { title: "Découvrir votre agent d'accueil × ByCo Systems" },
      {
        name: "description",
        content:
          "Démonstration interactive de la mini-application sur-mesure conçue par ByCo Systems : testez l'agent d'accueil en direct.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Découvrir votre agent d'accueil × ByCo Systems" },
      {
        property: "og:description",
        content: "Pendant que vous travaillez, qui répond au téléphone ? Testez Orlane en direct.",
      },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Découvrir votre agent d'accueil × ByCo Systems" },
      {
        name: "twitter:description",
        content: "Pendant que vous travaillez, qui répond au téléphone ? Testez Orlane en direct.",
      },
    ],
  }),
});

/* ── Palette (identité ByCo) ───────────────────────────────────── */

const C = {
  noir: "#14181A",
  noirDeep: "#0D1012",
  noirLight: "#20262A",
  noirLighter: "#2C3438",
  teal: "#3E8073",
  tealDeep: "#2C5C52",
  tealLight: "#6FAE9F",
  tealBg: "#EAF3F0",
  paper: "#F6F3EE",
  paperDeep: "#EAE5DC",
  ink: "#1A1A1A",
  inkSoft: "#5B6360",
  line: "#DDD6C9",
  lineDark: "#33393D",
  terracotta: "#B85C3E",
  terracottaBg: "#F5E8E2",
  whatsapp: "#25D366",
  whatsappDeep: "#128C7E",
};

const SERIF = '"Playfair Display", Georgia, serif';
const SANS = '"Inter", "Helvetica Neue", system-ui, sans-serif';

// Ligne Orlane — même numéro de démo que sur bycosystems.xyz et sur la
// démo Cabinet des Pignes, pont Twilio déjà en place. Ne rien reconstruire.
const ORLANE_HREF = "tel:+447576594092";
const WHATSAPP_URL = "https://wa.me/447576594092";

/* ── Vocabulaire sectoriel ──────────────────────────────────────
   Un seul paramètre pilote quelques formulations ciblées ; le reste
   de la page (structure, mécanique d'appel, récap WhatsApp) est
   partagé, pour éviter toute duplication de page par secteur.
   ─────────────────────────────────────────────────────────────── */

type Secteur = "sante" | "urgence" | "default";

function resolveSecteur(raw: string | undefined): Secteur {
  if (raw === "sante" || raw === "urgence") return raw;
  return "default";
}

type Copy = {
  eyebrowHero: string;
  headline: string;
  accrocheHeadline: string;
  accrocheP1: string;
  accrocheP2: string;
  chips: { label: string; value: string; accent?: boolean }[];
  demoIntro: string;
  whatsappBody: string;
  recapTitle: string;
  recapBody: string;
};

const COPY: Record<Secteur, Copy> = {
  sante: {
    eyebrowHero: "▪ Toujours disponible pour vos patients ▪",
    headline: "Pendant votre consultation, qui répond au téléphone ?",
    accrocheHeadline: "Vous, en consultation : qui décroche ?",
    accrocheP1:
      "Beaucoup de cabinets tiennent grâce à un seul praticien, toujours le même, toujours disponible pour ses patients. C'est une force — et une vraie promesse de qualité.",
    accrocheP2:
      "Le revers, lui, n'est jamais dit à voix haute : quand vous êtes en consultation, personne d'autre n'est là pour décrocher — ni pour une question de tarif, ni pour une urgence.",
    chips: [
      { label: "Consultation", value: "Sur demande" },
      { label: "Urgence", value: "Prioritaire", accent: true },
      { label: "Rendez-vous", value: "7j/7" },
      { label: "Zone", value: "Votre secteur" },
    ],
    demoIntro:
      "C'est vous qui appelez ci-dessous : un vrai appel vers Orlane, l'agent vocal de démonstration ByCo. Une fois configuré et personnalisé pour votre cabinet, votre agent saura restituer ce type d'information — en voici un exemple.",
    whatsappBody:
      "Dès que vous raccrochez, un récapitulatif part directement sur WhatsApp : le motif de l'appel, le numéro du patient, et ce qu'il attend de vous. Rien ne se perd — même au bloc.",
    recapTitle: "📞 Nouvel appel reçu",
    recapBody:
      "Un patient a appelé pour une question de tarif consultation.\nNuméro : +33 6 XX XX XX XX\nSouhaite être rappelé si besoin.",
  },
  urgence: {
    eyebrowHero: "▪ Toujours disponible pour vos clients ▪",
    headline: "Pendant votre intervention, qui répond au téléphone ?",
    accrocheHeadline: "Vous, sur place : qui décroche ?",
    accrocheP1:
      "Beaucoup d'artisans tiennent grâce à une seule personne, toujours la même, toujours disponible pour dépanner. C'est une force — et une vraie promesse de réactivité.",
    accrocheP2:
      "Le revers, lui, n'est jamais dit à voix haute : quand vous êtes sur une intervention, personne d'autre n'est là pour décrocher — ni pour une urgence, ni pour un simple devis.",
    chips: [
      { label: "Dépannage", value: "Sur demande" },
      { label: "Urgence", value: "Prioritaire", accent: true },
      { label: "Intervention", value: "7j/7" },
      { label: "Zone", value: "Votre secteur" },
    ],
    demoIntro:
      "C'est vous qui appelez ci-dessous : un vrai appel vers Orlane, l'agent vocal de démonstration ByCo. Une fois configuré et personnalisé pour votre activité, votre agent saura restituer ce type d'information — en voici un exemple.",
    whatsappBody:
      "Dès que vous raccrochez, un récapitulatif part directement sur WhatsApp : le motif de l'appel, le numéro du client, et ce qu'il attend de vous. Rien ne se perd — même en pleine intervention.",
    recapTitle: "📞 Nouvel appel reçu",
    recapBody:
      "Un client a appelé pour une demande d'intervention urgente.\nNuméro : +33 6 XX XX XX XX\nSouhaite être rappelé si besoin.",
  },
  default: {
    eyebrowHero: "▪ Toujours disponible pour vos clients ▪",
    headline: "Pendant que vous travaillez, qui répond au téléphone ?",
    accrocheHeadline: "Vous, pendant que vous travaillez : qui décroche ?",
    accrocheP1:
      "Beaucoup de petites entreprises tiennent grâce à une seule personne, toujours la même, toujours disponible pour ses clients. C'est une force — et une vraie promesse de qualité.",
    accrocheP2:
      "Le revers, lui, n'est jamais dit à voix haute : quand cette personne est occupée avec un client, personne d'autre n'est là pour décrocher — ni pour une question simple, ni pour une urgence.",
    chips: [
      { label: "Devis", value: "Sur demande" },
      { label: "Urgence", value: "Prioritaire", accent: true },
      { label: "Disponibilité", value: "7j/7" },
      { label: "Zone", value: "Votre secteur" },
    ],
    demoIntro:
      "C'est vous qui appelez ci-dessous : un vrai appel vers Orlane, l'agent vocal de démonstration ByCo. Une fois configuré et personnalisé pour votre activité, votre agent saura restituer ce type d'information — en voici un exemple.",
    whatsappBody:
      "Dès que vous raccrochez, un récapitulatif part directement sur WhatsApp : le motif de l'appel, le numéro du client, et ce qu'il attend de vous. Rien ne se perd — même quand vous êtes occupé.",
    recapTitle: "📞 Nouvel appel reçu",
    recapBody:
      "Un client a appelé pour une demande de renseignement.\nNuméro : +33 6 XX XX XX XX\nSouhaite être rappelé si besoin.",
  },
};

/* ── Composant principal ────────────────────────────────────── */

function DecouvrirDemo() {
  const { secteur: rawSecteur } = Route.useSearch();
  const secteur = resolveSecteur(rawSecteur);
  const copy = COPY[secteur];
  const [called, setCalled] = useState(false);

  return (
    <div style={{ fontFamily: SANS, background: C.paper, color: C.ink }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap"
      />
      <Hero copy={copy} />
      <Accroche copy={copy} />
      <DemoInteractive copy={copy} called={called} setCalled={setCalled} />
      <WhatsAppConfirmation copy={copy} called={called} />
      <OffreDecouverte />
      <Footer />
    </div>
  );
}

/* ── Section 1 — Hero ───────────────────────────────────────── */

function Hero({ copy }: { copy: Copy }) {
  return (
    <div style={{ position: "relative", background: C.noir }}>
      <div
        style={{
          position: "relative",
          height: "clamp(300px, 44vw, 460px)",
          overflow: "hidden",
          background: `linear-gradient(150deg, ${C.noir} 0%, ${C.noirLight} 55%, ${C.tealDeep} 100%)`,
        }}
      >
        <DemoTag />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "clamp(20px, 4vw, 44px) clamp(20px, 6vw, 64px)",
          }}
        >
          <div style={{ maxWidth: 620 }}>
            <div
              style={{
                fontSize: 10.5,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: C.tealLight,
                marginBottom: 12,
              }}
            >
              {copy.eyebrowHero}
            </div>
            <h1
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(26px, 4.4vw, 44px)",
                color: "#fff",
                fontWeight: 700,
                lineHeight: 1.2,
                margin: 0,
                textShadow: "0 2px 14px rgba(0,0,0,0.5)",
              }}
            >
              {copy.headline}
            </h1>
            <p
              style={{
                marginTop: 14,
                fontSize: "clamp(13.5px, 1.6vw, 16px)",
                color: "rgba(255,255,255,0.82)",
                lineHeight: 1.55,
                maxWidth: 480,
              }}
            >
              Une démonstration interactive, adaptée à votre activité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoTag() {
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 2,
        background: "rgba(20,24,26,0.85)",
        color: C.tealLight,
        fontSize: 8,
        letterSpacing: "0.14em",
        padding: "4px 10px",
        borderRadius: 20,
        textTransform: "uppercase",
        border: `1px solid ${C.tealLight}`,
        fontWeight: 600,
      }}
    >
      Démo ByCo
    </div>
  );
}

/* ── Section 2 — Accroche ──────────────────────────────────── */

function Accroche({ copy }: { copy: Copy }) {
  return (
    <Section bg={C.paper}>
      <Container>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <Eyebrow color={C.terracotta} center>
            Ce que votre site ne dit pas
          </Eyebrow>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(24px, 3.4vw, 34px)",
              color: C.ink,
              fontWeight: 700,
              lineHeight: 1.25,
              margin: "10px 0 18px",
            }}
          >
            {copy.accrocheHeadline}
          </h2>
          <p style={{ fontSize: 14.5, color: C.inkSoft, lineHeight: 1.7, margin: "0 0 14px" }}>
            {copy.accrocheP1}
          </p>
          <p style={{ fontSize: 14.5, color: C.inkSoft, lineHeight: 1.7, margin: 0 }}>
            {copy.accrocheP2}
          </p>
        </div>
      </Container>
    </Section>
  );
}

/* ── Section 3 — Démo interactive ──────────────────────────── */

function DemoInteractive({
  copy,
  called,
  setCalled,
}: {
  copy: Copy;
  called: boolean;
  setCalled: (v: boolean) => void;
}) {
  return (
    <Section bg={C.noir} id="demo">
      <Container>
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 34px" }}>
          <Eyebrow color={C.tealLight} center>
            À vous de tester
          </Eyebrow>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(22px, 3vw, 30px)",
              color: "#fff",
              fontWeight: 700,
              lineHeight: 1.3,
              margin: "10px 0 14px",
            }}
          >
            Testez la technologie qui répondra à vos clients
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.6, margin: 0 }}>
            {copy.demoIntro}
          </p>
        </div>

        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            background: C.noirLight,
            border: `1px solid ${C.lineDark}`,
            borderRadius: 20,
            padding: "clamp(22px, 4vw, 34px)",
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginBottom: 10,
            }}
          >
            Exemple : ce que VOTRE agent saura
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 26 }}>
            {copy.chips.map((chip) => (
              <InfoChip
                key={chip.label}
                label={chip.label}
                value={chip.value}
                accent={chip.accent}
              />
            ))}
          </div>

          <a
            href={ORLANE_HREF}
            onClick={() => setCalled(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              boxSizing: "border-box",
              padding: "17px 20px",
              borderRadius: 13,
              background: C.teal,
              color: "#fff",
              fontSize: 15.5,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: `0 10px 30px rgba(62,128,115,0.4)`,
            }}
          >
            📞 Appeler Orlane
          </a>
          <div
            style={{
              textAlign: "center",
              marginTop: 12,
              fontSize: 11.5,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Un seul effet à ce clic : votre téléphone compose immédiatement le numéro d'Orlane,
            l'assistant de démonstration ByCo — pas un agent déjà configuré pour votre activité.
          </div>
        </div>
      </Container>
    </Section>
  );
}

function InfoChip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      style={{
        flex: "1 1 auto",
        minWidth: 118,
        background: accent ? "rgba(184,92,62,0.16)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${accent ? "rgba(184,92,62,0.4)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 11,
        padding: "10px 14px",
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: accent ? "#E2A088" : "rgba(255,255,255,0.5)",
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 15, color: "#fff", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

/* ── Section 4 — Confirmation WhatsApp ─────────────────────── */

function WhatsAppConfirmation({ copy, called }: { copy: Copy; called: boolean }) {
  return (
    <Section bg={C.paperDeep}>
      <Container>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(24px, 4vw, 48px)",
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <Eyebrow color={C.tealDeep}>Après l'appel</Eyebrow>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(22px, 3vw, 28px)",
                color: C.ink,
                fontWeight: 700,
                lineHeight: 1.3,
                margin: "10px 0 14px",
              }}
            >
              Chaque appel devient un message WhatsApp
            </h2>
            <p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.65, margin: "0 0 12px" }}>
              {copy.whatsappBody}
            </p>
            <p
              style={{
                fontSize: 12.5,
                color: C.inkSoft,
                lineHeight: 1.6,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {called
                ? "Message généré suite à votre appel test ci-dessus."
                : "Appelez le numéro de démo ci-dessus pour voir ce message apparaître ici."}
            </p>
          </div>

          <div
            style={{ flex: "1 1 280px", minWidth: 260, display: "flex", justifyContent: "center" }}
          >
            <WhatsAppMock copy={copy} called={called} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function WhatsAppMock({ copy, called }: { copy: Copy; called: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 320,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(20,24,26,0.16)",
        border: `1px solid ${C.line}`,
      }}
    >
      <div
        style={{
          background: C.whatsappDeep,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "#fff",
            fontWeight: 700,
          }}
        >
          O
        </div>
        <div>
          <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 600 }}>
            Orlane · Assistant ByCo
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>en ligne</div>
        </div>
      </div>
      <div
        style={{
          background: "#E9DFCF",
          minHeight: 210,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {called ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "4px 12px 12px 12px",
              padding: "12px 14px",
              fontSize: 12.5,
              color: C.ink,
              lineHeight: 1.55,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              whiteSpace: "pre-line",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{copy.recapTitle}</div>
            {copy.recapBody}
            <div style={{ marginTop: 6, fontSize: 10, color: C.inkSoft }}>Envoyé à l'instant</div>
          </div>
        ) : (
          <div
            style={{
              background: "rgba(255,255,255,0.55)",
              borderRadius: "4px 12px 12px 12px",
              padding: "12px 14px",
              fontSize: 12,
              color: C.inkSoft,
              fontStyle: "italic",
              border: `1px dashed ${C.line}`,
            }}
          >
            En attente de votre appel test…
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Section 5 — L'offre ────────────────────────────────────── */

function OffreDecouverte() {
  return (
    <Section bg={C.noir}>
      <Container>
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            background: C.noirLight,
            border: `1px solid ${C.lineDark}`,
            borderRadius: 20,
            padding: "clamp(26px, 5vw, 42px)",
            textAlign: "center",
          }}
        >
          <Eyebrow color={C.tealLight} center>
            Envie d'aller plus loin ?
          </Eyebrow>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(22px, 3vw, 28px)",
              color: "#fff",
              fontWeight: 700,
              margin: "10px 0 16px",
            }}
          >
            Le plan Premium — 1 990 €
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.65,
              maxWidth: 480,
              margin: "0 auto 20px",
            }}
          >
            Audit complet du workflow d'accueil, Orlane et son automatisation WhatsApp,
            personnalisation avancée pour votre activité, remise à niveau du site, 30 jours de suivi
            post-livraison, mise en place prioritaire. Prix plein, paiement unique, aucun
            abonnement.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 10,
              marginBottom: 22,
            }}
          >
            <OfferBadge>Plan Premium · 1 990 €</OfferBadge>
            <OfferBadge>Satisfait ou remboursé sous 30 jours, sans condition</OfferBadge>
            <OfferBadge>Contrepartie : un témoignage vidéo</OfferBadge>
          </div>

          <p
            style={{
              fontSize: 11.5,
              color: "rgba(255,255,255,0.4)",
              margin: "0 auto 26px",
              maxWidth: 440,
              lineHeight: 1.5,
            }}
          >
            Les formules Essential, Business et Business+ restent consultables sur{" "}
            <a
              href="https://bycosystems.xyz"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              le site principal ByCo Systems
            </a>
            .
          </p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              padding: "15px 30px",
              borderRadius: 12,
              background: C.whatsapp,
              color: "#fff",
              fontSize: 14.5,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 10px 28px rgba(37,211,102,0.35)",
            }}
          >
            💬 Écrire à Orlane sur WhatsApp
          </a>
          <div style={{ marginTop: 12, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            Même ligne Orlane, cette fois sur WhatsApp — votre message nous parvient directement.
          </div>
        </div>
      </Container>
    </Section>
  );
}

function OfferBadge({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "7px 14px",
        borderRadius: 20,
        border: `1px solid ${C.tealLight}`,
        color: C.tealLight,
        fontSize: 11.5,
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </div>
  );
}

/* ── Footer ─────────────────────────────────────────────────── */

function Footer() {
  return (
    <Section bg={C.noirDeep}>
      <Container>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
            Démonstration générique · adaptable à votre secteur
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
            Démonstration personnalisable · ByCo Systems · bycosystems.xyz
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ── UI Primitives ──────────────────────────────────────────── */

function Section({ children, bg, id }: { children: React.ReactNode; bg: string; id?: string }) {
  return (
    <div id={id} style={{ background: bg, padding: "clamp(40px, 7vw, 76px) 0" }}>
      {children}
    </div>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(18px, 5vw, 40px)" }}>
      {children}
    </div>
  );
}

function Eyebrow({
  children,
  color,
  center,
}: {
  children: React.ReactNode;
  color: string;
  center?: boolean;
}) {
  return (
    <div
      style={{
        fontSize: 10.5,
        letterSpacing: "0.26em",
        textTransform: "uppercase",
        color,
        fontWeight: 700,
        textAlign: center ? "center" : "left",
      }}
    >
      {children}
    </div>
  );
}
