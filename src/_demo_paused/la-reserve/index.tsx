// ─────────────────────────────────────────────────────────────
// src/routes/demo/la-reserve/index.tsx
// "La Réserve · Depuis 1862" — démo mini-application pour La Réserve de Nice
// Conçue par ByCo Systems. Démonstration personnalisable.
//
// DÉPLOIEMENT :
//   1. Placer ce fichier dans  src/routes/demo/la-reserve/index.tsx
//   2. Placer le PDF comparatif dans  public/demo/la-reserve/comparatif.pdf
//   3. git add . && git commit && git push  → Cloudflare Pages déploie
//   4. URL publique : https://bycosystems.xyz/demo/la-reserve
//
// Pure front-end, aucune dépendance backend. TanStack Start + React + TS.
// Styles inline pour garantir un rendu identique à la démo validée.
// ─────────────────────────────────────────────────────────────

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/demo/la-reserve/")({
  component: LaReserve,
  head: () => ({
    meta: [
      { title: "La Réserve de Nice · Depuis 1862 × ByCo Systems" },
      {
        name: "description",
        content:
          "Démonstration interactive de la mini-application sur-mesure conçue par ByCo Systems pour La Réserve de Nice.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "La Réserve de Nice · Depuis 1862 × ByCo Systems" },
      {
        property: "og:description",
        content:
          "Démonstration interactive de la mini-application sur-mesure conçue par ByCo Systems pour La Réserve de Nice.",
      },
      { property: "og:image", content: "https://bycosystems.xyz/demo/la-reserve/og-image.jpg" },
      { name: "twitter:title", content: "La Réserve de Nice · Depuis 1862 × ByCo Systems" },
      {
        name: "twitter:description",
        content:
          "Démonstration interactive de la mini-application sur-mesure conçue par ByCo Systems pour La Réserve de Nice.",
      },
      { name: "twitter:image", content: "https://bycosystems.xyz/demo/la-reserve/og-image.jpg" },
    ],
  }),
});

/* ── Palette ────────────────────────────────────────────────── */

const C = {
  marine:     "#0D1B2A",
  marineMid:  "#1B3A5C",
  marineDark: "#091320",
  or:         "#B8962E",
  orLight:    "#D4AE4E",
  orDark:     "#8A6E1E",
  ivoire:     "#F5F0E8",
  ivoireDeep: "#EAE3D6",
  bordeaux:   "#6B2737",
  grisPerle:  "#C8C0B4",
  vertMer:    "#2C6E6A",
  vertMerBg:  "#E8F2F1",
  encre:      "#1A1412",
  line:       "#D8D0C4",
};

const SERIF  = '"Cormorant Garamond", Georgia, serif';
const SERIF2 = '"Playfair Display", Georgia, serif';
const SANS   = '"Inter", "Helvetica Neue", system-ui, sans-serif';

/* ── Date dynamique ────────────────────────────────────────── */

const MOIS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function prochainVendredi(): string {
  const today = new Date();
  const jour = today.getDay();
  const offsetLundi = jour === 0 ? -6 : 1 - jour;
  const lundiCetteSemaine = new Date(today);
  lundiCetteSemaine.setDate(today.getDate() + offsetLundi);
  const vendrediProchain = new Date(lundiCetteSemaine);
  vendrediProchain.setDate(lundiCetteSemaine.getDate() + 11);
  return `Vendredi ${vendrediProchain.getDate()} ${MOIS_FR[vendrediProchain.getMonth()]}`;
}

/* ── Types ─────────────────────────────────────────────────── */

type ScreenId = "accueil" | "experience" | "reservation" | "matable" | "apres";
type ReservMode = "table" | "evenement" | "rooftop";

/* ── Composant principal ────────────────────────────────────── */

function LaReserve() {
  const [screen, setScreen] = useState<ScreenId>("accueil");

  // Réservation — mode table
  const [date,           setDate]           = useState("2025-07-12");
  const [service,        setService]        = useState("Dîner (19h15)");
  const [couverts,       setCouverts]       = useState(2);
  const [espace,         setEspace]         = useState("Terrasse");
  const [nom,            setNom]            = useState("");
  const [whatsapp,       setWhatsapp]       = useState("");
  const [allergies,      setAllergies]      = useState("");
  const [menu,           setMenu]           = useState("");
  const [tableFormSent,  setTableFormSent]  = useState(false);
  const [tableFormTouched, setTableFormTouched] = useState(false);

  // Réservation — mode événement
  const [evtEspace,      setEvtEspace]      = useState("");
  const [evtDate,        setEvtDate]        = useState("");
  const [evtPersonnes,   setEvtPersonnes]   = useState("");
  const [evtContact,     setEvtContact]     = useState("");
  const [evtWhatsapp,    setEvtWhatsapp]    = useState("");
  const [evtMessage,     setEvtMessage]     = useState("");
  const [evtFormSent,    setEvtFormSent]    = useState(false);
  const [evtFormTouched, setEvtFormTouched] = useState(false);

  // Réservation — mode rooftop
  const [rfDate,         setRfDate]         = useState("");
  const [rfHeure,        setRfHeure]        = useState("");
  const [rfPersonnes,    setRfPersonnes]    = useState(2);
  const [rfNom,          setRfNom]          = useState("");
  const [rfWhatsapp,     setRfWhatsapp]     = useState("");
  const [rfFormSent,     setRfFormSent]     = useState(false);
  const [rfFormTouched,  setRfFormTouched]  = useState(false);

  const [reservMode, setReservMode] = useState<ReservMode>("table");

  // Ma Table
  const [tableAction, setTableAction] = useState<null | "retard" | "modifier" | "annuler">(null);

  // Après
  const [favori,      setFavori]      = useState<string | null>(null);
  const [newsletter,  setNewsletter]  = useState(false);
  const [avisClicked, setAvisClicked] = useState(false);

  const goReservRooftop = () => {
    setReservMode("rooftop");
    go("reservation");
  };

  const go = (s: ScreenId) => {
    setScreen(s);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  return (
    <div
      style={{
        fontFamily: SANS,
        background: C.marine,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "16px 0",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap"
      />
      <div
        style={{
          width: 390,
          maxWidth: "100%",
          background: C.ivoire,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
          position: "relative",
          minHeight: 780,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopBar screen={screen} />
        <div style={{ flex: 1, position: "relative" }}>
          {screen === "accueil" && <Accueil go={go} />}
          {screen === "experience" && <Experience go={go} />}
          {screen === "reservation" && (
            <Reservation
              go={go}
              reservMode={reservMode}
              setReservMode={setReservMode}
              tableState={{ date, service, couverts, espace, nom, whatsapp, allergies, menu, tableFormSent, tableFormTouched }}
              tableSet={{ setDate, setService, setCouverts, setEspace, setNom, setWhatsapp, setAllergies, setMenu, setTableFormSent, setTableFormTouched }}
              evtState={{ evtEspace, evtDate, evtPersonnes, evtContact, evtWhatsapp, evtMessage, evtFormSent, evtFormTouched }}
              evtSet={{ setEvtEspace, setEvtDate, setEvtPersonnes, setEvtContact, setEvtWhatsapp, setEvtMessage, setEvtFormSent, setEvtFormTouched }}
              rfState={{ rfDate, rfHeure, rfPersonnes, rfNom, rfWhatsapp, rfFormSent, rfFormTouched }}
              rfSet={{ setRfDate, setRfHeure, setRfPersonnes, setRfNom, setRfWhatsapp, setRfFormSent, setRfFormTouched }}
            />
          )}
          {screen === "matable" && (
            <MaTable go={go} tableAction={tableAction} setTableAction={setTableAction} />
          )}
          {screen === "apres" && (
            <Apres
              go={go}
              goReservRooftop={goReservRooftop}
              favori={favori}
              setFavori={setFavori}
              newsletter={newsletter}
              setNewsletter={setNewsletter}
              avisClicked={avisClicked}
              setAvisClicked={setAvisClicked}
            />
          )}
        </div>
        <NavBar screen={screen} go={go} />
        <DemoTag />
      </div>
    </div>
  );
}

/* ── Chrome ─────────────────────────────────────────────────── */

function TopBar({ screen }: { screen: ScreenId }) {
  const titles: Record<ScreenId, string> = {
    accueil:     "",
    experience:  "L'Expérience",
    reservation: "Réservation",
    matable:     "Ma Table",
    apres:       "Après le Repas",
  };
  return (
    <div
      style={{
        background: C.marine,
        padding: "18px 22px 14px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 20,
          letterSpacing: "0.36em",
          color: C.ivoire,
          fontWeight: 600,
          textTransform: "uppercase",
          lineHeight: 1.1,
        }}
      >
        La Réserve
      </div>
      <div
        style={{
          fontSize: 8.5,
          letterSpacing: "0.38em",
          color: C.or,
          textTransform: "uppercase",
          marginTop: 4,
        }}
      >
        Nice · Depuis 1862
      </div>
      {titles[screen] ? (
        <div
          style={{
            fontFamily: SERIF2,
            fontSize: 13,
            fontStyle: "italic",
            color: C.orLight,
            marginTop: 10,
            opacity: 0.9,
          }}
        >
          {titles[screen]}
        </div>
      ) : null}
    </div>
  );
}

function NavBar({ screen, go }: { screen: ScreenId; go: (s: ScreenId) => void }) {
  const items: { id: ScreenId; label: string; icon: string }[] = [
    { id: "accueil",     label: "Accueil",    icon: "⌂" },
    { id: "experience",  label: "Menus",      icon: "❧" },
    { id: "reservation", label: "Réserver",   icon: "✎" },
    { id: "matable",     label: "Ma Table",   icon: "◈" },
    { id: "apres",       label: "Après",      icon: "✦" },
  ];
  return (
    <div
      style={{
        display: "flex",
        background: C.marineDark,
        borderTop: `2px solid ${C.or}`,
      }}
    >
      {items.map((it) => {
        const active = screen === it.id;
        return (
          <button
            key={it.id}
            onClick={() => go(it.id)}
            style={{
              flex: 1,
              border: "none",
              background: active ? C.or : "transparent",
              color: active ? C.marineDark : C.grisPerle,
              padding: "10px 2px 9px",
              cursor: "pointer",
              transition: "all 0.22s",
            }}
          >
            <div style={{ fontSize: 14, lineHeight: 1 }}>{it.icon}</div>
            <div
              style={{
                fontSize: 7.5,
                letterSpacing: "0.05em",
                marginTop: 4,
                textTransform: "uppercase",
                fontWeight: active ? 700 : 500,
              }}
            >
              {it.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function DemoTag() {
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        background: "rgba(13,27,42,0.92)",
        color: C.or,
        fontSize: 7.5,
        letterSpacing: "0.12em",
        padding: "3px 8px",
        borderRadius: 20,
        textTransform: "uppercase",
        border: `1px solid ${C.or}`,
        fontWeight: 600,
      }}
    >
      Démo ByCo
    </div>
  );
}

/* ── Écran 1 — Accueil ──────────────────────────────────────── */

function Accueil({ go }: { go: (s: ScreenId) => void }) {
  return (
    <div style={{ paddingBottom: 28 }}>
      {/* Hero */}
      <div
        style={{
          position: "relative",
          height: 240,
          background: `linear-gradient(180deg, ${C.marine} 0%, ${C.marineMid} 100%)`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 80%, rgba(184,150,46,0.12) 0%, transparent 65%)",
          }}
        />
        {/* Texture horizontale subtile évoquant la mer */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: "linear-gradient(to top, rgba(13,27,42,0.5) 0%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 28px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: C.or,
              marginBottom: 16,
            }}
          >
            Baie des Anges · Nice
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 24,
              color: C.ivoire,
              lineHeight: 1.35,
              fontWeight: 500,
            }}
          >
            Depuis 1862, une table d'exception
            <br />
            face à la Baie des Anges.
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 11,
              color: C.grisPerle,
              letterSpacing: "0.12em",
            }}
          >
            Chef Jérôme Cotta · Guide Michelin
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 22px 0" }}>
        {/* Carte réservation fictive */}
        <div
          style={{
            background: C.marine,
            borderRadius: 14,
            padding: "16px 18px",
            borderLeft: `4px solid ${C.or}`,
            position: "relative",
            overflow: "hidden",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: C.or,
              opacity: 0.08,
            }}
          />
          <div
            style={{
              fontSize: 8.5,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: C.or,
              marginBottom: 6,
            }}
          >
            Votre réservation
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 19,
              color: C.ivoire,
              fontWeight: 600,
            }}
          >
            {prochainVendredi()} · 20h00
          </div>
          <div style={{ fontSize: 12.5, color: C.grisPerle, marginTop: 4 }}>
            Table pour 2 · Isabelle
          </div>
          <div style={{ fontSize: 11.5, color: "#7A9EBE", marginTop: 3 }}>
            Terrasse face à la mer · Vue Baie des Anges
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "grid", gap: 11 }}>
          <PrimaryButton onClick={() => go("reservation")}>
            Réserver ma table
          </PrimaryButton>
          <GhostButton onClick={() => go("experience")}>
            Découvrir l'expérience
          </GhostButton>
        </div>

        {/* Info bar */}
        <div
          style={{
            marginTop: 18,
            padding: "13px 16px",
            background: C.ivoireDeep,
            borderRadius: 12,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: C.encre,
              lineHeight: 1.55,
              textAlign: "center",
            }}
          >
            <span style={{ color: C.or, fontWeight: 600 }}>60 Bd Franck Pilatte · Nice</span>
            {"  ·  "}Mar–Sam{"  ·  "}12h15 &amp; 19h15
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 6,
              fontSize: 11,
              color: C.vertMer,
              fontWeight: 600,
            }}
          >
            ★ 4.5 · 1 490 avis Google · Ticket moyen 120€
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Écran 2 — L'Expérience ────────────────────────────────── */

function Experience({ go }: { go: (s: ScreenId) => void }) {
  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Titre */}
      <div
        style={{
          background: C.marine,
          padding: "22px 24px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 21,
            fontStyle: "italic",
            color: C.ivoire,
            lineHeight: 1.35,
            fontWeight: 500,
          }}
        >
          Une croisière gastronomique
          <br />
          ancrée en Méditerranée
        </div>
      </div>

      <div style={{ padding: "22px 20px 0" }}>

        {/* ── SECTION 1 : Les menus ── */}
        <SectionTitle>Les Menus</SectionTitle>

        <div style={{ display: "grid", gap: 12, marginTop: 12, marginBottom: 24 }}>
          {/* Menu Réserve */}
          <div
            style={{
              background: C.marine,
              borderRadius: 16,
              padding: "20px 20px 22px",
              border: `1px solid ${C.marineMid}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -18,
                right: -18,
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: C.or,
                opacity: 0.08,
              }}
            />
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: C.grisPerle,
                marginBottom: 6,
              }}
            >
              Entrée · Plat · Dessert — au choix
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 24,
                color: C.ivoire,
                fontWeight: 600,
              }}
            >
              Menu Réserve
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 30,
                color: C.or,
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              110<span style={{ fontSize: 16 }}>€</span>
            </div>
            <button
              onClick={() => go("reservation")}
              style={{
                marginTop: 14,
                width: "100%",
                padding: "11px",
                borderRadius: 10,
                border: `1.5px solid ${C.or}`,
                background: "transparent",
                color: C.or,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: SANS,
                transition: "all 0.2s",
              }}
            >
              Choisir ce menu
            </button>
          </div>

          {/* Menu Grande Réserve */}
          <div
            style={{
              background: `linear-gradient(145deg, ${C.orDark} 0%, #6B4E14 100%)`,
              borderRadius: 16,
              padding: "20px 20px 22px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 14,
                right: 16,
                fontSize: 8,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                background: C.ivoire,
                color: C.orDark,
                padding: "3px 9px",
                borderRadius: 20,
                fontWeight: 700,
              }}
            >
              ★ Recommandé
            </div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,0.8)",
                marginBottom: 6,
              }}
            >
              2 entrées · Plat · Fromages &amp; Desserts
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 24,
                color: C.ivoire,
                fontWeight: 600,
              }}
            >
              Menu Grande Réserve
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 30,
                color: C.ivoire,
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              135<span style={{ fontSize: 16 }}>€</span>
            </div>
            <button
              onClick={() => go("reservation")}
              style={{
                marginTop: 14,
                width: "100%",
                padding: "11px",
                borderRadius: 10,
                border: "none",
                background: C.ivoire,
                color: C.orDark,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: SANS,
                transition: "all 0.2s",
              }}
            >
              Choisir ce menu
            </button>
          </div>
        </div>

        {/* ── SECTION 2 : Plats signature ── */}
        <SectionTitle>Plats Signature du Chef</SectionTitle>
        <div
          style={{
            overflowX: "auto",
            display: "flex",
            gap: 12,
            padding: "12px 0 4px",
            scrollbarWidth: "none",
            marginBottom: 24,
          }}
        >
          {[
            { nom: "Langoustines croustillantes", desc: "céleri, aïoli, sucs de bisque" },
            { nom: "Saint-Jacques en carpaccio", desc: "texture et fraîcheur" },
            { nom: "Bar sauvage", desc: "émulsion d'arêtes au Noilly Prat" },
            { nom: "Ris de veau laqué", desc: "clémentine et timut" },
          ].map((p) => (
            <div
              key={p.nom}
              style={{
                minWidth: 155,
                background: C.marine,
                borderRadius: 14,
                padding: "16px 15px 18px",
                border: `1px solid ${C.marineMid}`,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 15,
                  color: C.ivoire,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  marginBottom: 8,
                }}
              >
                {p.nom}
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 11.5,
                  color: C.grisPerle,
                  lineHeight: 1.4,
                }}
              >
                {p.desc}
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "inline-block",
                  background: "rgba(184,150,46,0.15)",
                  color: C.or,
                  fontSize: 8.5,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  padding: "2px 8px",
                  borderRadius: 10,
                  textTransform: "uppercase",
                }}
              >
                Gault&amp;Millau
              </div>
            </div>
          ))}
        </div>

        {/* ── SECTION 3 : Les espaces ── */}
        <SectionTitle>Nos Espaces</SectionTitle>
        <div style={{ display: "grid", gap: 10, marginTop: 12, marginBottom: 24 }}>
          {[
            {
              nom: "La Salle Art Déco",
              desc: "Baies vitrées panoramiques sur la mer",
              badge: null,
            },
            {
              nom: "La Terrasse",
              desc: "Les pieds dans l'eau face à la Baie des Anges",
              badge: null,
            },
            {
              nom: "Le Rooftop",
              desc: "Soirées musicales, cocktails, coucher de soleil",
              badge: "Mai–Octobre",
            },
          ].map((e) => (
            <div
              key={e.nom}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "15px 16px",
                border: `1px solid ${C.line}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 15,
                    color: C.encre,
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  {e.nom}
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: 12,
                    color: C.grisPerle,
                  }}
                >
                  {e.desc}
                </div>
              </div>
              {e.badge && (
                <div
                  style={{
                    flexShrink: 0,
                    fontSize: 8.5,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    background: C.vertMerBg,
                    color: C.vertMer,
                    padding: "3px 8px",
                    borderRadius: 10,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.badge}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── SECTION 4 : Bons cadeaux ── */}
        <div
          style={{
            padding: "18px 18px",
            background: C.bordeaux,
            borderRadius: 14,
            color: C.ivoire,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(245,240,232,0.7)",
              marginBottom: 5,
            }}
          >
            ✦ Bons Cadeaux
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Offrir La Réserve
          </div>
          <p
            style={{
              fontSize: 12,
              color: "rgba(245,240,232,0.82)",
              lineHeight: 1.5,
              margin: "0 0 14px",
            }}
          >
            Bon cadeau personnalisé, numéroté à l'argent à chaud.
          </p>
          <button
            onClick={() => {}}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: 10,
              border: `1.5px solid rgba(245,240,232,0.4)`,
              background: "transparent",
              color: C.ivoire,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: SANS,
            }}
          >
            En savoir plus
          </button>
        </div>

        <PrimaryButton onClick={() => go("reservation")}>
          Réserver ma table
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ── Écran 3 — Réservation ──────────────────────────────────── */

function Reservation({
  go,
  reservMode,
  setReservMode,
  tableState,
  tableSet,
  evtState,
  evtSet,
  rfState,
  rfSet,
}: {
  go: (s: ScreenId) => void;
  reservMode: ReservMode;
  setReservMode: (m: ReservMode) => void;
  tableState: {
    date: string; service: string; couverts: number; espace: string;
    nom: string; whatsapp: string; allergies: string; menu: string;
    tableFormSent: boolean; tableFormTouched: boolean;
  };
  tableSet: {
    setDate: (v: string) => void; setService: (v: string) => void;
    setCouverts: (v: number) => void; setEspace: (v: string) => void;
    setNom: (v: string) => void; setWhatsapp: (v: string) => void;
    setAllergies: (v: string) => void; setMenu: (v: string) => void;
    setTableFormSent: (v: boolean) => void; setTableFormTouched: (v: boolean) => void;
  };
  evtState: {
    evtEspace: string; evtDate: string; evtPersonnes: string;
    evtContact: string; evtWhatsapp: string; evtMessage: string;
    evtFormSent: boolean; evtFormTouched: boolean;
  };
  evtSet: {
    setEvtEspace: (v: string) => void; setEvtDate: (v: string) => void;
    setEvtPersonnes: (v: string) => void; setEvtContact: (v: string) => void;
    setEvtWhatsapp: (v: string) => void; setEvtMessage: (v: string) => void;
    setEvtFormSent: (v: boolean) => void; setEvtFormTouched: (v: boolean) => void;
  };
  rfState: {
    rfDate: string; rfHeure: string; rfPersonnes: number;
    rfNom: string; rfWhatsapp: string; rfFormSent: boolean; rfFormTouched: boolean;
  };
  rfSet: {
    setRfDate: (v: string) => void; setRfHeure: (v: string) => void;
    setRfPersonnes: (v: number) => void; setRfNom: (v: string) => void;
    setRfWhatsapp: (v: string) => void; setRfFormSent: (v: boolean) => void;
    setRfFormTouched: (v: boolean) => void;
  };
}) {
  return (
    <div style={{ paddingBottom: 28 }}>
      {/* En-tête + Toggle */}
      <div
        style={{
          background: C.marine,
          padding: "14px 20px 16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 13,
            fontStyle: "italic",
            color: C.grisPerle,
            marginBottom: 14,
          }}
        >
          60 Boulevard Franck Pilatte · Nice
        </div>
        {/* Toggle 3 modes */}
        <div
          style={{
            display: "flex",
            background: C.marineDark,
            borderRadius: 12,
            padding: 4,
            gap: 4,
          }}
        >
          {(["table", "evenement", "rooftop"] as ReservMode[]).map((mode) => {
            const active = reservMode === mode;
            const labels = { table: "Ma table", evenement: "Événement", rooftop: "Rooftop" };
            return (
              <button
                key={mode}
                onClick={() => setReservMode(mode)}
                style={{
                  flex: 1,
                  padding: "9px 4px",
                  borderRadius: 9,
                  border: "none",
                  background: active ? C.or : "transparent",
                  color: active ? C.marineDark : C.grisPerle,
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.22s",
                  fontFamily: SANS,
                }}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>
      </div>

      {reservMode === "table"    && <ReservTable go={go} state={tableState} set={tableSet} />}
      {reservMode === "evenement" && <ReservEvenement go={go} state={evtState} set={evtSet} />}
      {reservMode === "rooftop"  && <ReservRooftop go={go} state={rfState} set={rfSet} />}
    </div>
  );
}

/* Mode "Ma table" */
function ReservTable({
  go,
  state,
  set,
}: {
  go: (s: ScreenId) => void;
  state: {
    date: string; service: string; couverts: number; espace: string;
    nom: string; whatsapp: string; allergies: string; menu: string;
    tableFormSent: boolean; tableFormTouched: boolean;
  };
  set: {
    setDate: (v: string) => void; setService: (v: string) => void;
    setCouverts: (v: number) => void; setEspace: (v: string) => void;
    setNom: (v: string) => void; setWhatsapp: (v: string) => void;
    setAllergies: (v: string) => void; setMenu: (v: string) => void;
    setTableFormSent: (v: boolean) => void; setTableFormTouched: (v: boolean) => void;
  };
}) {
  const { date, service, couverts, espace, nom, whatsapp, allergies, menu, tableFormSent, tableFormTouched } = state;
  const { setDate, setService, setCouverts, setEspace, setNom, setWhatsapp, setAllergies, setMenu, setTableFormSent, setTableFormTouched } = set;

  const nomErr     = tableFormTouched && !nom.trim();
  const wappErr    = tableFormTouched && !whatsapp.trim();
  const serviceErr = tableFormTouched && !service;
  const valid      = nom.trim() && whatsapp.trim() && service && date;

  if (tableFormSent) {
    return (
      <div
        style={{
          padding: "44px 26px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: C.or,
            color: C.marineDark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            marginBottom: 22,
            boxShadow: `0 8px 24px rgba(184,150,46,0.45)`,
          }}
        >
          ✓
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 23,
            color: C.encre,
            lineHeight: 1.3,
            fontWeight: 600,
          }}
        >
          Parfait {nom.split(" ")[0] || "Isabelle"},
        </div>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 14.5,
            color: C.grisPerle,
            lineHeight: 1.55,
            marginTop: 12,
            maxWidth: 300,
          }}
        >
          votre table du {prochainVendredi().toLowerCase()} à 20h00 est réservée à La Réserve. Chef Jérôme Cotta vous attend. Un message WhatsApp de confirmation vous sera envoyé dans quelques instants.
        </p>
        <div style={{ marginTop: 24, width: "100%" }}>
          <PrimaryButton onClick={() => go("matable")}>
            Voir ma table
          </PrimaryButton>
        </div>
        <button
          onClick={() => setTableFormSent(false)}
          style={{
            marginTop: 12,
            background: "none",
            border: "none",
            color: C.grisPerle,
            fontSize: 12,
            textDecoration: "underline",
            cursor: "pointer",
            fontFamily: SANS,
          }}
        >
          Modifier mes informations
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 22px 28px" }}>
      <Field label="1 · Date souhaitée">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle()}
        />
      </Field>

      <Field label="2 · Service" error={serviceErr ? "Choisissez un service" : ""}>
        <div style={{ display: "flex", gap: 10 }}>
          {["Déjeuner (12h15)", "Dîner (19h15)"].map((s) => {
            const sel = service === s;
            return (
              <button
                key={s}
                onClick={() => setService(s)}
                style={{
                  flex: 1,
                  padding: "12px 6px",
                  borderRadius: 10,
                  border: sel ? `1.5px solid ${C.or}` : serviceErr ? `1.5px solid #C05050` : `1px solid ${C.line}`,
                  background: sel ? C.or : "#fff",
                  color: sel ? C.marineDark : C.grisPerle,
                  fontSize: 12.5,
                  fontWeight: sel ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: SANS,
                  transition: "all 0.18s",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="3 · Nombre de couverts">
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "10+"].map((n) => {
            const sel = couverts === n || (n === "10+" && couverts >= 10);
            return (
              <button
                key={n}
                onClick={() => setCouverts(n === "10+" ? 10 : (n as number))}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  border: sel ? `1.5px solid ${C.or}` : `1px solid ${C.line}`,
                  background: sel ? C.or : "#fff",
                  color: sel ? C.marineDark : C.grisPerle,
                  fontSize: 12.5,
                  fontWeight: sel ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: SANS,
                  transition: "all 0.18s",
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="4 · Espace préféré">
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {["Salle Art Déco", "Terrasse", "Pas de préférence"].map((opt) => {
            const sel = espace === opt;
            return (
              <button
                key={opt}
                onClick={() => setEspace(opt)}
                style={{
                  padding: "9px 13px",
                  borderRadius: 22,
                  border: sel ? `1.5px solid ${C.or}` : `1px solid ${C.line}`,
                  background: sel ? C.or : "#fff",
                  color: sel ? C.marineDark : C.grisPerle,
                  fontSize: 12,
                  fontWeight: sel ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: SANS,
                  transition: "all 0.18s",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="5 · Prénom et nom" error={nomErr ? "Ce champ est requis" : ""}>
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Isabelle Dupont"
          style={inputStyle(nomErr)}
        />
      </Field>

      <Field label="6 · Numéro WhatsApp" sublabel="Pour votre confirmation et rappel" error={wappErr ? "Ce champ est requis" : ""}>
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="+33 6 12 34 56 78"
          type="tel"
          style={inputStyle(wappErr)}
        />
      </Field>

      <Field label="7 · Allergies ou restrictions">
        <textarea
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="Crustacés, fruits à coque, végétarien… ou aucune"
          rows={3}
          style={{ ...inputStyle(), resize: "none", lineHeight: 1.45 }}
        />
      </Field>

      <Field label="8 · Menu souhaité">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Menu Réserve 110€", "Grande Réserve 135€", "À décider sur place"].map((opt) => {
            const sel = menu === opt;
            return (
              <button
                key={opt}
                onClick={() => setMenu(opt)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 22,
                  border: sel ? `1.5px solid ${C.or}` : `1px solid ${C.line}`,
                  background: sel ? C.or : "#fff",
                  color: sel ? C.marineDark : C.grisPerle,
                  fontSize: 12,
                  fontWeight: sel ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: SANS,
                  transition: "all 0.18s",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Field>

      <div style={{ marginTop: 10 }}>
        <PrimaryButton
          onClick={() => {
            setTableFormTouched(true);
            if (valid) setTableFormSent(true);
          }}
        >
          Confirmer ma réservation
        </PrimaryButton>
        {tableFormTouched && !valid && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#C05050", textAlign: "center" }}>
            Veuillez renseigner votre nom, WhatsApp et le service souhaité.
          </div>
        )}
      </div>
    </div>
  );
}

/* Mode "Événement privé" */
function ReservEvenement({
  go,
  state,
  set,
}: {
  go: (s: ScreenId) => void;
  state: {
    evtEspace: string; evtDate: string; evtPersonnes: string;
    evtContact: string; evtWhatsapp: string; evtMessage: string;
    evtFormSent: boolean; evtFormTouched: boolean;
  };
  set: {
    setEvtEspace: (v: string) => void; setEvtDate: (v: string) => void;
    setEvtPersonnes: (v: string) => void; setEvtContact: (v: string) => void;
    setEvtWhatsapp: (v: string) => void; setEvtMessage: (v: string) => void;
    setEvtFormSent: (v: boolean) => void; setEvtFormTouched: (v: boolean) => void;
  };
}) {
  const { evtEspace, evtDate, evtPersonnes, evtContact, evtWhatsapp, evtMessage, evtFormSent, evtFormTouched } = state;
  const { setEvtEspace, setEvtDate, setEvtPersonnes, setEvtContact, setEvtWhatsapp, setEvtMessage, setEvtFormSent, setEvtFormTouched } = set;

  const contactErr = evtFormTouched && !evtContact.trim();
  const wappErr    = evtFormTouched && !evtWhatsapp.trim();
  const espaceErr  = evtFormTouched && !evtEspace;
  const valid      = evtEspace && evtDate && evtContact.trim() && evtWhatsapp.trim();

  if (evtFormSent) {
    return (
      <div style={{ padding: "44px 26px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: C.vertMer,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            marginBottom: 22,
            boxShadow: `0 8px 24px rgba(44,110,106,0.45)`,
          }}
        >
          ✓
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 22, color: C.encre, lineHeight: 1.3, fontWeight: 600 }}>
          Merci {evtContact.split(" ")[0] || "Isabelle"},
        </div>
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 14, color: C.grisPerle, lineHeight: 1.55, marginTop: 12, maxWidth: 300 }}>
          votre demande d'événement privé à La Réserve a été transmise. Notre équipe vous recontacte sous 24h.
        </p>
        <button
          onClick={() => setEvtFormSent(false)}
          style={{ marginTop: 16, background: "none", border: "none", color: C.grisPerle, fontSize: 12, textDecoration: "underline", cursor: "pointer", fontFamily: SANS }}
        >
          Modifier ma demande
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 22px 28px" }}>
      <Field label="1 · Espace souhaité" error={espaceErr ? "Choisissez un espace" : ""}>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {["Double Decker 1er étage", "Privatisation salle", "Terrasse complète"].map((opt) => {
            const sel = evtEspace === opt;
            return (
              <button
                key={opt}
                onClick={() => setEvtEspace(opt)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 22,
                  border: sel ? `1.5px solid ${C.or}` : espaceErr ? `1.5px solid #C05050` : `1px solid ${C.line}`,
                  background: sel ? C.or : "#fff",
                  color: sel ? C.marineDark : C.grisPerle,
                  fontSize: 12,
                  fontWeight: sel ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: SANS,
                  transition: "all 0.18s",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="2 · Date souhaitée">
        <input type="date" value={evtDate} onChange={(e) => setEvtDate(e.target.value)} style={inputStyle()} />
      </Field>

      <Field label="3 · Nombre de personnes">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["10–30", "30–70", "70–110", "110+"].map((n) => {
            const sel = evtPersonnes === n;
            return (
              <button
                key={n}
                onClick={() => setEvtPersonnes(n)}
                style={{
                  padding: "9px 14px",
                  borderRadius: 22,
                  border: sel ? `1.5px solid ${C.or}` : `1px solid ${C.line}`,
                  background: sel ? C.or : "#fff",
                  color: sel ? C.marineDark : C.grisPerle,
                  fontSize: 12,
                  fontWeight: sel ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: SANS,
                  transition: "all 0.18s",
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="4 · Prénom, nom et société" error={contactErr ? "Ce champ est requis" : ""}>
        <input
          value={evtContact}
          onChange={(e) => setEvtContact(e.target.value)}
          placeholder="Isabelle Martin · Société XYZ"
          style={inputStyle(contactErr)}
        />
      </Field>

      <Field label="5 · Numéro WhatsApp" error={wappErr ? "Ce champ est requis" : ""}>
        <input
          value={evtWhatsapp}
          onChange={(e) => setEvtWhatsapp(e.target.value)}
          placeholder="+33 6 12 34 56 78"
          type="tel"
          style={inputStyle(wappErr)}
        />
      </Field>

      <Field label="6 · Description de votre événement">
        <textarea
          value={evtMessage}
          onChange={(e) => setEvtMessage(e.target.value)}
          placeholder="Décrivez votre projet en quelques mots…"
          rows={4}
          style={{ ...inputStyle(), resize: "none", lineHeight: 1.45 }}
        />
      </Field>

      <div style={{ marginTop: 10 }}>
        <PrimaryButton
          onClick={() => {
            setEvtFormTouched(true);
            if (valid) setEvtFormSent(true);
          }}
        >
          Envoyer ma demande
        </PrimaryButton>
        {evtFormTouched && !valid && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#C05050", textAlign: "center" }}>
            Veuillez renseigner espace, date, contact et WhatsApp.
          </div>
        )}
      </div>
    </div>
  );
}

/* Mode "Rooftop" */
function ReservRooftop({
  go,
  state,
  set,
}: {
  go: (s: ScreenId) => void;
  state: {
    rfDate: string; rfHeure: string; rfPersonnes: number;
    rfNom: string; rfWhatsapp: string; rfFormSent: boolean; rfFormTouched: boolean;
  };
  set: {
    setRfDate: (v: string) => void; setRfHeure: (v: string) => void;
    setRfPersonnes: (v: number) => void; setRfNom: (v: string) => void;
    setRfWhatsapp: (v: string) => void; setRfFormSent: (v: boolean) => void;
    setRfFormTouched: (v: boolean) => void;
  };
}) {
  const { rfDate, rfHeure, rfPersonnes, rfNom, rfWhatsapp, rfFormSent, rfFormTouched } = state;
  const { setRfDate, setRfHeure, setRfPersonnes, setRfNom, setRfWhatsapp, setRfFormSent, setRfFormTouched } = set;

  const nomErr   = rfFormTouched && !rfNom.trim();
  const wappErr  = rfFormTouched && !rfWhatsapp.trim();
  const heureErr = rfFormTouched && !rfHeure;
  const valid    = rfDate && rfHeure && rfNom.trim() && rfWhatsapp.trim();

  if (rfFormSent) {
    return (
      <div style={{ padding: "44px 26px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: C.or,
            color: C.marineDark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            marginBottom: 22,
            boxShadow: `0 8px 24px rgba(184,150,46,0.45)`,
          }}
        >
          ✓
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 23, color: C.encre, lineHeight: 1.3, fontWeight: 600 }}>
          {rfNom.split(" ")[0] || "Isabelle"},
        </div>
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 14.5, color: C.grisPerle, lineHeight: 1.55, marginTop: 12, maxWidth: 300 }}>
          Votre soirée au Rooftop est confirmée. Vue unique sur le port et la Baie des Anges. Un rappel WhatsApp vous sera envoyé la veille.
        </p>
        <button
          onClick={() => setRfFormSent(false)}
          style={{ marginTop: 16, background: "none", border: "none", color: C.grisPerle, fontSize: 12, textDecoration: "underline", cursor: "pointer", fontFamily: SANS }}
        >
          Modifier mes informations
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 22px 28px" }}>
      {/* Badge saisonnier */}
      <div
        style={{
          background: C.vertMerBg,
          border: `1px solid ${C.vertMer}30`,
          borderRadius: 10,
          padding: "11px 14px",
          marginBottom: 18,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 18, lineHeight: 1 }}>☀️</div>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.vertMer }}>
            Rooftop ouvert de mai à octobre
          </div>
          <div style={{ fontSize: 11, color: "#4A7C7A", marginTop: 2 }}>
            Soirées musicales · cocktails · grillades · tapas
          </div>
        </div>
      </div>

      <Field label="1 · Date souhaitée">
        <input
          type="date"
          value={rfDate}
          onChange={(e) => setRfDate(e.target.value)}
          style={inputStyle()}
          min="2025-05-01"
          max="2025-10-31"
        />
      </Field>

      <Field label="2 · Heure" error={heureErr ? "Choisissez une heure" : ""}>
        <div style={{ display: "flex", gap: 10 }}>
          {["After Work (17h00)", "Soirée (21h00)"].map((h) => {
            const sel = rfHeure === h;
            return (
              <button
                key={h}
                onClick={() => setRfHeure(h)}
                style={{
                  flex: 1,
                  padding: "12px 6px",
                  borderRadius: 10,
                  border: sel ? `1.5px solid ${C.or}` : heureErr ? `1.5px solid #C05050` : `1px solid ${C.line}`,
                  background: sel ? C.or : "#fff",
                  color: sel ? C.marineDark : C.grisPerle,
                  fontSize: 12.5,
                  fontWeight: sel ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: SANS,
                  transition: "all 0.18s",
                }}
              >
                {h}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="3 · Nombre de personnes">
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {[1, 2, 3, 4, 5, 6, 8, "10+"].map((n) => {
            const sel = rfPersonnes === n || (n === "10+" && rfPersonnes >= 10);
            return (
              <button
                key={n}
                onClick={() => setRfPersonnes(n === "10+" ? 10 : (n as number))}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 9,
                  border: sel ? `1.5px solid ${C.or}` : `1px solid ${C.line}`,
                  background: sel ? C.or : "#fff",
                  color: sel ? C.marineDark : C.grisPerle,
                  fontSize: 13,
                  fontWeight: sel ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: SANS,
                  transition: "all 0.18s",
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="4 · Prénom et nom" error={nomErr ? "Ce champ est requis" : ""}>
        <input
          value={rfNom}
          onChange={(e) => setRfNom(e.target.value)}
          placeholder="Isabelle Dupont"
          style={inputStyle(nomErr)}
        />
      </Field>

      <Field label="5 · Numéro WhatsApp" error={wappErr ? "Ce champ est requis" : ""}>
        <input
          value={rfWhatsapp}
          onChange={(e) => setRfWhatsapp(e.target.value)}
          placeholder="+33 6 12 34 56 78"
          type="tel"
          style={inputStyle(wappErr)}
        />
      </Field>

      <div style={{ marginTop: 10 }}>
        <PrimaryButton
          onClick={() => {
            setRfFormTouched(true);
            if (valid) setRfFormSent(true);
          }}
        >
          Réserver le Rooftop
        </PrimaryButton>
        {rfFormTouched && !valid && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#C05050", textAlign: "center" }}>
            Veuillez renseigner date, heure, nom et WhatsApp.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Écran 4 — Ma Table ─────────────────────────────────────── */

function MaTable({
  go,
  tableAction,
  setTableAction,
}: {
  go: (s: ScreenId) => void;
  tableAction: null | "retard" | "modifier" | "annuler";
  setTableAction: (v: null | "retard" | "modifier" | "annuler") => void;
}) {
  return (
    <div style={{ padding: "22px 22px 28px" }}>
      {/* Carte réservation */}
      <div
        style={{
          background: C.marine,
          borderRadius: 16,
          padding: "20px 20px 22px",
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${C.marineMid}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -28,
            right: -28,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: C.or,
            opacity: 0.08,
          }}
        />
        <div
          style={{
            fontSize: 8.5,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: C.or,
            marginBottom: 6,
          }}
        >
          Votre réservation confirmée
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 22,
            color: C.ivoire,
            fontWeight: 600,
            lineHeight: 1.25,
          }}
        >
          {prochainVendredi()} · 20h00
        </div>
        <div style={{ fontSize: 13, color: C.grisPerle, marginTop: 5 }}>
          Table pour 2 · Isabelle
        </div>
        <div style={{ fontSize: 12, color: "#7A9EBE", marginTop: 3 }}>
          Terrasse · Vue Baie des Anges
        </div>
        <div style={{ fontSize: 12, color: C.orLight, marginTop: 3 }}>
          Menu Grande Réserve · 135€/pers
        </div>
      </div>

      {/* Banners */}
      {tableAction === "retard" && (
        <Banner tone="ok">Retard signalé à l'équipe de La Réserve.</Banner>
      )}
      {tableAction === "modifier" && (
        <Banner tone="neutral">Demande de modification transmise. L'équipe vous recontacte sous peu.</Banner>
      )}
      {tableAction === "annuler" && (
        <Banner tone="neutral">
          Annulation enregistrée. Merci de nous avoir prévenus.
        </Banner>
      )}

      {/* 3 actions */}
      <div style={{ marginTop: 16, display: "grid", gap: 9 }}>
        <button onClick={() => setTableAction("retard")} style={actionBtn(tableAction === "retard")}>
          ⏱ Prévenir d'un retard
        </button>
        <div style={{ display: "flex", gap: 9 }}>
          <button onClick={() => setTableAction("modifier")} style={{ ...actionBtn(tableAction === "modifier"), flex: 1 }}>
            ✎ Modifier
          </button>
          <button onClick={() => setTableAction("annuler")} style={{ ...actionBtn(tableAction === "annuler"), flex: 1 }}>
            ✕ Annuler
          </button>
        </div>
        {tableAction && (
          <button
            onClick={() => setTableAction(null)}
            style={{ background: "none", border: "none", color: C.grisPerle, fontSize: 12, textDecoration: "underline", cursor: "pointer", fontFamily: SANS, padding: "4px 0" }}
          >
            Revenir
          </button>
        )}
      </div>

      {/* Bloc WhatsApp */}
      <div
        style={{
          marginTop: 16,
          padding: "15px 16px",
          background: C.vertMerBg,
          borderRadius: 12,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          border: `1px solid ${C.vertMer}30`,
        }}
      >
        <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>💬</div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.vertMer, marginBottom: 3 }}>
            Rappel WhatsApp
          </div>
          <div style={{ fontSize: 12, color: "#3A6E6A", lineHeight: 1.4 }}>
            Un rappel vous sera envoyé demain à 17h00 sur votre WhatsApp
          </div>
        </div>
      </div>

      {/* Bloc prestige */}
      <div
        style={{
          marginTop: 14,
          padding: "15px 16px",
          background: "rgba(184,150,46,0.08)",
          borderRadius: 12,
          border: `1px solid ${C.or}30`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: C.orDark,
            fontWeight: 600,
            lineHeight: 1.5,
            fontFamily: SERIF,
            fontStyle: "italic",
          }}
        >
          ★ Établissement au Guide Michelin 2026
        </div>
        <div style={{ fontSize: 11.5, color: C.grisPerle, marginTop: 3 }}>
          Cuisine méditerranéenne · Chef Jérôme Cotta
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <GhostButton onClick={() => go("apres")}>
          Après le repas →
        </GhostButton>
      </div>
    </div>
  );
}

/* ── Écran 5 — Après le repas ───────────────────────────────── */

function Apres({
  go,
  goReservRooftop,
  favori,
  setFavori,
  newsletter,
  setNewsletter,
  avisClicked,
  setAvisClicked,
}: {
  go: (s: ScreenId) => void;
  goReservRooftop: () => void;
  favori: string | null;
  setFavori: (s: string) => void;
  newsletter: boolean;
  setNewsletter: (b: boolean) => void;
  avisClicked: boolean;
  setAvisClicked: (b: boolean) => void;
}) {
  return (
    <div style={{ padding: "22px 22px 28px" }}>
      {/* Titre */}
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 23,
            color: C.encre,
            fontWeight: 600,
            fontStyle: "italic",
          }}
        >
          Merci d'avoir choisi La Réserve
        </div>
        <p
          style={{
            fontFamily: SERIF2,
            fontStyle: "italic",
            fontSize: 13.5,
            color: C.grisPerle,
            margin: "10px 0 0",
            lineHeight: 1.5,
          }}
        >
          Votre avis perpétue une tradition depuis 1862
        </p>
      </div>

      {/* Moment préféré */}
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.marine,
            marginBottom: 10,
            fontWeight: 700,
          }}
        >
          Votre moment préféré ce soir ?
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {["La Terrasse", "Les plats du Chef", "Le service", "Le Rooftop", "L'atmosphère Art Déco"].map((label) => {
            const sel = favori === label;
            return (
              <button
                key={label}
                onClick={() => setFavori(label)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 22,
                  border: sel ? `1.5px solid ${C.marine}` : `1px solid ${C.line}`,
                  background: sel ? C.marine : "#fff",
                  color: sel ? C.ivoire : C.grisPerle,
                  fontSize: 12,
                  fontWeight: sel ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: SANS,
                  transition: "all 0.18s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Message spécial Rooftop */}
      {favori === "Le Rooftop" && (
        <div
          style={{
            padding: "16px 18px",
            background: C.marine,
            borderRadius: 14,
            marginBottom: 16,
            border: `1px solid ${C.or}`,
          }}
        >
          <div style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: C.or, marginBottom: 6 }}>
            ☀️ Rooftop · Mai–Octobre
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 15,
              color: C.ivoire,
              lineHeight: 1.4,
              marginBottom: 12,
            }}
          >
            Revivez cette soirée — le Rooftop est ouvert de mai à octobre.
          </div>
          <button
            onClick={goReservRooftop}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: 9,
              border: "none",
              background: C.or,
              color: C.marineDark,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: SANS,
            }}
          >
            Réserver le Rooftop
          </button>
        </div>
      )}

      {/* Avis Google */}
      <div
        style={{
          padding: "16px 17px",
          background: "#fff",
          borderRadius: 13,
          border: `1px solid ${C.line}`,
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 12.5, color: C.grisPerle, marginBottom: 10, lineHeight: 1.4 }}>
          Votre avis contribue au rayonnement d'une maison d'exception.
        </div>
        <button
          onClick={() => setAvisClicked(true)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: avisClicked ? C.vertMer : C.marine,
            color: C.ivoire,
            fontSize: 13.5,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: SANS,
            transition: "all 0.22s",
          }}
        >
          {avisClicked ? "✓ Merci pour votre avis !" : "Laisser un avis Google ★"}
        </button>
      </div>

      {/* Bon cadeau */}
      <div
        style={{
          padding: "18px 18px",
          background: C.bordeaux,
          borderRadius: 14,
          color: C.ivoire,
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(245,240,232,0.7)", marginBottom: 4 }}>
          ✦ Bons Cadeaux
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, marginBottom: 6 }}>
          Offrir La Réserve
        </div>
        <p style={{ fontSize: 12, color: "rgba(245,240,232,0.82)", lineHeight: 1.5, margin: "0 0 14px" }}>
          Un bon cadeau numéroté à l'argent à chaud — le présent des grandes occasions.
        </p>
        <button
          onClick={() => {}}
          style={{
            width: "100%",
            padding: "11px",
            borderRadius: 10,
            border: `1.5px solid rgba(245,240,232,0.35)`,
            background: "transparent",
            color: C.ivoire,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: SANS,
          }}
        >
          Découvrir les bons cadeaux
        </button>
      </div>

      {/* Newsletter */}
      <div
        style={{
          padding: "18px 18px",
          background: C.marine,
          borderRadius: 14,
          color: C.ivoire,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: C.or, marginBottom: 4 }}>
          ✦ Newsletter
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
          La Lettre de La Réserve
        </div>
        <p style={{ fontSize: 12, color: C.grisPerle, lineHeight: 1.5, margin: "0 0 14px" }}>
          Actualités du Chef, soirées du Rooftop, événements exclusifs — en avant-première.
        </p>
        <button
          onClick={() => setNewsletter(!newsletter)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: newsletter ? C.or : C.marineMid,
            color: newsletter ? C.marineDark : C.ivoire,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.02em",
            transition: "all 0.25s",
            fontFamily: SANS,
          }}
        >
          {newsletter ? "✓ Vous êtes abonné" : "Recevoir La Lettre"}
        </button>
      </div>

      <PrimaryButton onClick={() => go("reservation")}>
        Réserver ma prochaine table
      </PrimaryButton>

      {/* Footer */}
      <div
        style={{
          marginTop: 24,
          textAlign: "center",
          borderTop: `1px solid ${C.line}`,
          paddingTop: 16,
        }}
      >
        <div style={{ fontSize: 10.5, color: C.grisPerle, lineHeight: 1.5 }}>
          Démonstration personnalisable · ByCo Systems · bycosystems.xyz
        </div>
      </div>
    </div>
  );
}

/* ── UI Primitives ──────────────────────────────────────────── */

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "14px 18px",
        borderRadius: 11,
        border: "none",
        background: disabled ? C.ivoireDeep : C.or,
        color: disabled ? C.grisPerle : C.marineDark,
        fontSize: 13.5,
        fontWeight: 700,
        letterSpacing: "0.02em",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: SANS,
        transition: "all 0.2s",
        boxShadow: disabled ? "none" : `0 4px 16px rgba(184,150,46,0.35)`,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "13px 18px",
        borderRadius: 11,
        border: `1.5px solid ${C.marine}`,
        background: "transparent",
        color: C.marine,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: SANS,
        transition: "all 0.2s",
      }}
    >
      {children}
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9.5,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: C.or,
        fontWeight: 700,
        borderBottom: `1px solid ${C.line}`,
        paddingBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  sublabel,
  error,
  children,
}: {
  label: string;
  sublabel?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: C.marine,
          fontWeight: 700,
          marginBottom: sublabel ? 2 : 9,
        }}
      >
        {label}
      </div>
      {sublabel && (
        <div style={{ fontSize: 11, color: C.grisPerle, marginBottom: 8, fontStyle: "italic" }}>
          {sublabel}
        </div>
      )}
      {children}
      {error && (
        <div style={{ fontSize: 11, color: "#C05050", marginTop: 5 }}>{error}</div>
      )}
    </div>
  );
}

function Banner({ children, tone }: { children: React.ReactNode; tone: "ok" | "neutral" }) {
  const bg = tone === "ok" ? C.vertMerBg : C.ivoireDeep;
  const bd = tone === "ok" ? C.vertMer : C.or;
  return (
    <div
      style={{
        marginTop: 14,
        padding: "12px 15px",
        background: bg,
        borderLeft: `3px solid ${bd}`,
        borderRadius: 10,
        fontSize: 12.5,
        color: C.encre,
        lineHeight: 1.45,
      }}
    >
      {children}
    </div>
  );
}

function actionBtn(active: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "13px",
    borderRadius: 10,
    border: active ? `1.5px solid ${C.or}` : `1px solid ${C.line}`,
    background: active ? C.ivoireDeep : "#fff",
    color: active ? C.marine : C.grisPerle,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: SANS,
    transition: "all 0.2s",
    textAlign: "center" as const,
  };
}

function inputStyle(hasError?: boolean): React.CSSProperties {
  return {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "12px 14px",
    borderRadius: 10,
    border: hasError ? `1.5px solid #C05050` : `1px solid ${C.line}`,
    background: "#fff",
    fontSize: 13.5,
    color: C.encre,
    fontFamily: SANS,
    outline: "none",
  };
}
