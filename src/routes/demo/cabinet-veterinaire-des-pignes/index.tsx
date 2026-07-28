// ─────────────────────────────────────────────────────────────
// src/routes/demo/cabinet-veterinaire-des-pignes/index.tsx
// Démo mini-app pour le Cabinet Vétérinaire des Pignes · Dr Nicolas Arnaud · Nice
// Conçue par ByCo Systems. Démonstration personnalisable.
//
// DÉPLOIEMENT :
//   1. Placer ce fichier dans  src/routes/demo/cabinet-veterinaire-des-pignes/index.tsx
//   2. git add . && git commit && git push  → Cloudflare Pages déploie
//   3. URL publique : https://bycosystems.xyz/demo/cabinet-veterinaire-des-pignes
//
// Pure front-end, aucune dépendance backend. TanStack Start + React + TS.
// Styles inline pour garantir un rendu identique à la démo validée.
//
// Contrairement aux démos restaurant (Le Panier / La Réserve / Les Sens /
// Maison F), cette démo n'est pas un mockup d'application mobile : c'est une
// page de vente qui met en scène le vrai point de douleur du prospect (la
// joignabilité téléphonique pendant les consultations), avec un appel test
// réel vers la ligne Orlane.
// ─────────────────────────────────────────────────────────────

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/demo/cabinet-veterinaire-des-pignes/")({
  component: CabinetDesPignes,
  head: () => ({
    meta: [
      { title: "Cabinet Vétérinaire des Pignes · Toujours joignable × ByCo Systems" },
      {
        name: "description",
        content:
          "Démonstration interactive de la mini-application sur-mesure conçue par ByCo Systems pour le Cabinet Vétérinaire des Pignes · Dr Nicolas Arnaud · Nice.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Cabinet Vétérinaire des Pignes × ByCo Systems" },
      {
        property: "og:description",
        content: "Pendant que le Dr Arnaud opère, qui répond au téléphone ? Testez Orlane en direct.",
      },
      { property: "og:image", content: HERO_PHOTO },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Cabinet Vétérinaire des Pignes × ByCo Systems" },
      {
        name: "twitter:description",
        content: "Pendant que le Dr Arnaud opère, qui répond au téléphone ? Testez Orlane en direct.",
      },
      { name: "twitter:image", content: HERO_PHOTO },
    ],
  }),
});

/* ── Palette ────────────────────────────────────────────────── */

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

/* ── Éléments réels du prospect ─────────────────────────────── */

const LOGO =
  "https://www.cabinetveterinairedespignes.com/wp-content/uploads/2021/03/Cabinet-veterinaire-des-pignes-logo2-quadri-noir.png";

// Photos réelles du cabinet — variantes redimensionnées par WordPress
// (les fichiers d'origine, non recadrés, pèsent 6 à 9 Mo pièce).
const HERO_PHOTO =
  "https://www.cabinetveterinairedespignes.com/wp-content/uploads/2021/03/Image-Cabinet.jpg";

const CABINET_PHOTOS = [
  "https://www.cabinetveterinairedespignes.com/wp-content/uploads/2021/03/IMG_20210208_162325-300x224.jpg",
  "https://www.cabinetveterinairedespignes.com/wp-content/uploads/2021/03/IMG_20210208_162338-300x224.jpg",
  "https://www.cabinetveterinairedespignes.com/wp-content/uploads/2021/03/IMG_20210208_162431-300x224.jpg",
];

const DR_ARNAUD_PHOTO =
  "https://www.cabinetveterinairedespignes.com/wp-content/uploads/2021/03/image-Dr-Arnaud.jpg";

// Ligne Orlane — même numéro de démo que sur bycosystems.xyz, préconfiguré
// avec le contexte du Cabinet des Pignes pour cette démonstration.
const ORLANE_HREF = "tel:+447576594092";
const ORLANE_DISPLAY = "+44 7576 594092";
const WHATSAPP_URL = "https://wa.me/447576594092";

const ADRESSE = "3 Rue Alfred Binet, 06000 Nice";
const TEL_FIXE = "04 93 84 30 19";
const TEL_URGENCE = "06 20 46 50 40";

/* ── Composant principal ────────────────────────────────────── */

function CabinetDesPignes() {
  const [called, setCalled] = useState(false);

  return (
    <div style={{ fontFamily: SANS, background: C.paper, color: C.ink }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap"
      />
      <Hero />
      <Accroche />
      <DemoInteractive called={called} setCalled={setCalled} />
      <WhatsAppConfirmation called={called} />
      <SiteRemisANiveau />
      <OffrePilote />
      <Footer />
    </div>
  );
}

/* ── Section 1 — Hero ───────────────────────────────────────── */

function Hero() {
  return (
    <div style={{ position: "relative", background: C.noir }}>
      <div style={{ position: "relative", height: "clamp(340px, 52vw, 560px)", overflow: "hidden" }}>
        <SafeImg
          src={HERO_PHOTO}
          alt="Cabinet Vétérinaire des Pignes · Nice"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          fallbackStyle={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(150deg, ${C.noir} 0%, ${C.noirLight} 55%, ${C.tealDeep} 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(13,16,18,0.72) 0%, rgba(13,16,18,0.35) 42%, rgba(13,16,18,0.88) 100%)",
          }}
        />
        <DemoTag />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(20px, 4vw, 44px) clamp(20px, 6vw, 64px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <SafeLogoImg
              src={LOGO}
              style={{ height: 46, width: 46, objectFit: "contain", borderRadius: 8, background: "#fff", padding: 4 }}
              fallbackStyle={{
                height: 46,
                width: 46,
                borderRadius: 8,
                background: C.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: "#fff",
                fontWeight: 700,
              }}
              fallbackText="CP"
              alt="Logo Cabinet Vétérinaire des Pignes"
            />
            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(15px, 2vw, 18px)",
                  letterSpacing: "0.1em",
                  color: "#fff",
                  fontWeight: 600,
                  lineHeight: 1.15,
                }}
              >
                Cabinet Vétérinaire des Pignes
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.24em",
                  color: C.tealLight,
                  textTransform: "uppercase",
                  marginTop: 3,
                }}
              >
                Dr Nicolas Arnaud · Nice
              </div>
            </div>
          </div>

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
              ▪ Plus de 20 ans au service de vos animaux ▪
            </div>
            <h1
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(28px, 4.6vw, 46px)",
                color: "#fff",
                fontWeight: 700,
                lineHeight: 1.15,
                margin: 0,
                textShadow: "0 2px 14px rgba(0,0,0,0.5)",
              }}
            >
              Un seul praticien.
              <br />
              Une exigence de 20 ans.
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
              {ADRESSE} · Parking Gare du Sud à 20 mètres
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

function Accroche() {
  return (
    <Section bg={C.paper}>
      <Container>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(24px, 4vw, 48px)", alignItems: "center" }}>
          <div style={{ flex: "1 1 420px", minWidth: 280 }}>
            <Eyebrow color={C.terracotta}>Ce que le site ne dit pas</Eyebrow>
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
              Dr Arnaud, pendant que vous opérez, qui répond au téléphone ?
            </h2>
            <p style={{ fontSize: 14.5, color: C.inkSoft, lineHeight: 1.7, margin: "0 0 14px" }}>
              Le cabinet le revendique lui-même comme un argument fort : un seul praticien pour
              chaque animal, la garantie d'une prise en charge toujours assurée par la même
              personne. C'est vrai, et c'est précieux.
            </p>
            <p style={{ fontSize: 14.5, color: C.inkSoft, lineHeight: 1.7, margin: "0 0 14px" }}>
              Le corollaire, lui, n'est jamais dit à voix haute : quand le Dr Arnaud est en
              consultation ou au bloc, personne d'autre n'est là pour décrocher — ni pour une
              question de tarif, ni pour une urgence.
            </p>
            <p style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
              Un avis Google évoque d'ailleurs une confusion sur les horaires de joignabilité du
              cabinet — un signal, pas une exception.
            </p>
          </div>

          <div style={{ flex: "1 1 260px", minWidth: 240, display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "100%",
                maxWidth: 300,
                borderRadius: 18,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 20px 50px rgba(20,24,26,0.18)",
              }}
            >
              <SafeImg
                src={DR_ARNAUD_PHOTO}
                alt="Dr Nicolas Arnaud"
                style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }}
                fallbackStyle={{
                  width: "100%",
                  height: 340,
                  background: `linear-gradient(150deg, ${C.noirLight}, ${C.tealDeep})`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "20px 16px 14px",
                  background: "linear-gradient(to top, rgba(13,16,18,0.85), transparent)",
                }}
              >
                <div style={{ color: "#fff", fontFamily: SERIF, fontSize: 15, fontWeight: 600 }}>
                  Dr Nicolas Arnaud
                </div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 2 }}>
                  Vétérinaire · comportementaliste · 20+ ans d'expérience
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ── Section 3 — Démo interactive ──────────────────────────── */

function DemoInteractive({ called, setCalled }: { called: boolean; setCalled: (v: boolean) => void }) {
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
            Mettez-vous à la place d'un de vos clients
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.6, margin: 0 }}>
            Docteur Arnaud, c'est vous qui appelez ci-dessous — comme le ferait un client du
            cabinet. Orlane a déjà les informations du Cabinet des Pignes en mémoire, affichées
            juste ici avant même que vous ne décrochiez.
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
            Ce qu'Orlane sait déjà de votre cabinet
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 26,
            }}
          >
            <InfoChip label="Consultation" value="39 €" />
            <InfoChip label="Urgence" value="110 €" accent />
            <InfoChip label="Urgences" value="7j/7 · 10h–22h" />
            <InfoChip label="Parking" value="Gare du Sud · 20m" />
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
            <PhoneIcon /> Appeler {ORLANE_DISPLAY}
          </a>
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>
            Un seul effet à ce clic : votre téléphone compose immédiatement ce numéro — un appel
            réel vers la ligne de démonstration Orlane, aucune donnée conservée.
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

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/* ── Section 4 — Confirmation WhatsApp ─────────────────────── */

function WhatsAppConfirmation({ called }: { called: boolean }) {
  return (
    <Section bg={C.paperDeep}>
      <Container>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(24px, 4vw, 48px)", alignItems: "center" }}>
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
              Dès que vous raccrochez, un récapitulatif part directement sur WhatsApp : le motif
              de l'appel, le numéro du client, et ce qu'il attend de vous. Rien ne se perd — même
              quand vous êtes au bloc.
            </p>
            <p style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
              {called
                ? "Message généré suite à votre appel test ci-dessus."
                : "Appelez le numéro de démo ci-dessus pour voir ce message apparaître ici."}
            </p>
          </div>

          <div style={{ flex: "1 1 280px", minWidth: 260, display: "flex", justifyContent: "center" }}>
            <WhatsAppMock called={called} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function WhatsAppMock({ called }: { called: boolean }) {
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
          CP
        </div>
        <div>
          <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 600 }}>Orlane · Cabinet des Pignes</div>
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
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 4 }}>📞 Nouvel appel reçu</div>
            Un client a appelé pour une question de tarif consultation (39€).
            <br />
            Numéro : +33 6 XX XX XX XX
            <br />
            Souhaite être rappelé si besoin.
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

/* ── Section 5 — Le site remis à niveau ────────────────────── */

function SiteRemisANiveau() {
  const rows: { avant: string; apres: string }[] = [
    {
      avant: "Formulaire de contact qui exige JavaScript activé",
      apres: "Formulaire simplifié, accessible à tous vos visiteurs",
    },
    {
      avant: "Aucune prise de rendez-vous en ligne",
      apres: "Prise de rendez-vous en ligne, en quelques clics",
    },
    {
      avant: "Actualités et mentions figées depuis 2021",
      apres: "Contenu que vous pouvez actualiser vous-même",
    },
  ];

  return (
    <Section bg={C.paper}>
      <Container>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 36px" }}>
          <Eyebrow color={C.terracotta} center>
            Votre site, remis à niveau
          </Eyebrow>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(22px, 3vw, 28px)",
              color: C.ink,
              fontWeight: 700,
              lineHeight: 1.35,
              margin: "10px 0 0",
            }}
          >
            Le cabinet et l'équipement ont 20 ans d'excellence.
            <br />
            La vitrine numérique n'a pas suivi le même rythme.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
            gap: 1,
            background: C.line,
            borderRadius: 16,
            overflow: "hidden",
            border: `1px solid ${C.line}`,
            maxWidth: 760,
            margin: "0 auto",
          }}
        >
          <div style={{ background: "#fff", padding: "16px 18px" }}>
            <ColHeader color={C.inkSoft}>Aujourd'hui</ColHeader>
          </div>
          <div style={{ background: C.tealBg, padding: "16px 18px" }}>
            <ColHeader color={C.tealDeep}>Demain</ColHeader>
          </div>

          {rows.map((r, i) => (
            <RowPair key={i} avant={r.avant} apres={r.apres} />
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            maxWidth: 560,
            margin: "24px auto 0",
            fontSize: 12.5,
            color: C.inkSoft,
            lineHeight: 1.6,
          }}
        >
          Analyseur sanguin en 8 minutes, radio numérique en moins de 3 minutes, bloc chirurgical
          sur place : l'équipement du cabinet est déjà au niveau. Il ne manque qu'une vitrine qui
          le montre.
        </p>
      </Container>
    </Section>
  );
}

function ColHeader({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div
      style={{
        fontSize: 10.5,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 700,
        color,
      }}
    >
      {children}
    </div>
  );
}

function RowPair({ avant, apres }: { avant: string; apres: string }) {
  return (
    <>
      <div style={{ background: "#fff", padding: "14px 18px", fontSize: 13, color: C.inkSoft, lineHeight: 1.5 }}>
        {avant}
      </div>
      <div style={{ background: C.tealBg, padding: "14px 18px", fontSize: 13, color: C.tealDeep, lineHeight: 1.5, fontWeight: 500 }}>
        {apres}
      </div>
    </>
  );
}

/* ── Section 6 — L'offre ────────────────────────────────────── */

function OffrePilote() {
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
            L'offre pour le Cabinet des Pignes
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
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.65, maxWidth: 480, margin: "0 auto 20px" }}>
            Audit complet du workflow d'accueil, Orlane et son automatisation WhatsApp,
            personnalisation avancée, remise à niveau du site, 30 jours de suivi post-livraison,
            mise en place prioritaire. Prix plein, paiement unique, aucun abonnement.
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

          <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", margin: "0 auto 26px", maxWidth: 440, lineHeight: 1.5 }}>
            Les formules Essential, Business et Business+ restent consultables sur{" "}
            <a href="https://bycosystems.xyz" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.6)" }}>
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
            Discuter de l'offre Premium avec ByCo
          </a>
          <div style={{ marginTop: 12, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            Contact direct avec l'équipe ByCo — indépendant de la ligne Orlane testée plus haut.
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
            <span>{ADRESSE}</span>
            <span>{TEL_FIXE}</span>
            <span>Urgences {TEL_URGENCE} · 7j/7 · 10h–22h</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
              Démonstration personnalisable · ByCo Systems · bycosystems.xyz
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 3, fontStyle: "italic" }}>
              © Photos Cabinet Vétérinaire des Pignes — intégrées avec accord lors du déploiement final
            </div>
          </div>
        </div>
      </Container>
      {/* Bande photos discrète, pour rappel visuel du cabinet réel */}
      <Container>
        <div style={{ display: "flex", gap: 8, marginTop: 22, flexWrap: "wrap" }}>
          {CABINET_PHOTOS.map((src, i) => (
            <div key={i} style={{ flex: "1 1 100px", maxWidth: 140, borderRadius: 8, overflow: "hidden" }}>
              <SafeImg
                src={src}
                alt="Cabinet Vétérinaire des Pignes"
                style={{ width: "100%", height: 80, objectFit: "cover", display: "block", opacity: 0.7 }}
                fallbackStyle={{ width: "100%", height: 80, background: C.noirLight }}
              />
            </div>
          ))}
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
  return <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(18px, 5vw, 40px)" }}>{children}</div>;
}

function Eyebrow({ children, color, center }: { children: React.ReactNode; color: string; center?: boolean }) {
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

/* ── Image helpers ──────────────────────────────────────────── */

function SafeImg({
  src,
  alt,
  style,
  fallbackStyle,
}: {
  src: string;
  alt: string;
  style: React.CSSProperties;
  fallbackStyle: React.CSSProperties;
}) {
  const [error, setError] = useState(false);
  if (error) return <div style={fallbackStyle} aria-label={alt} />;
  return <img src={src} alt={alt} onError={() => setError(true)} style={style} />;
}

function SafeLogoImg({
  src,
  style,
  fallbackStyle,
  fallbackText,
  alt,
}: {
  src: string;
  style: React.CSSProperties;
  fallbackStyle: React.CSSProperties;
  fallbackText: string;
  alt: string;
}) {
  const [error, setError] = useState(false);
  if (error) return <div style={fallbackStyle}>{fallbackText}</div>;
  return <img src={src} alt={alt} onError={() => setError(true)} style={style} />;
}
