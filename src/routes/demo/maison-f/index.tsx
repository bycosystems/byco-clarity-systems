// ─────────────────────────────────────────────────────────────
// src/routes/demo/maison-f/index.tsx
// "Par amour du frais" — démo mini-application pour Maison F · Nice
// Conçue par ByCo Systems. Démonstration personnalisable.
//
// DÉPLOIEMENT :
//   1. Placer ce fichier dans  src/routes/demo/maison-f/index.tsx
//   2. Placer le PDF comparatif dans  public/demo/maison-f/comparatif.pdf
//   3. git add . && git commit && git push  → Cloudflare Pages déploie
//   4. URL publique : https://bycosystems.xyz/demo/maison-f
//
// Pure front-end, aucune dépendance backend. TanStack Start + React + TS.
// Styles inline pour garantir un rendu identique à la démo validée.
// ─────────────────────────────────────────────────────────────

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/demo/maison-f/")({
  component: MaisonF,
  head: () => ({
    meta: [
      { title: "Maison F · Par amour du frais × ByCo Systems" },
      {
        name: "description",
        content:
          "Démonstration interactive de la mini-application sur-mesure conçue par ByCo Systems pour Maison F · 8 Quai des Docks, Nice.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
});

/* ── Palette ────────────────────────────────────────────────── */

const C = {
  bleuNuit: "#1B2A3B",
  bleuNuitDark: "#121E2B",
  bleuNuitLight: "#253D56",
  or: "#C9A84C",
  orDark: "#A8863A",
  orLight: "#DFC070",
  blanc: "#F9F6F0",
  blancDeep: "#EDE8DE",
  sauge: "#7A9E7E",
  saugeBg: "#EAF2EA",
  encre: "#1A1A1A",
  gris: "#8A8A8A",
  line: "#DDD5C4",
};

const SERIF = '"Playfair Display", Georgia, serif';
const SANS = '"Inter", "Helvetica Neue", system-ui, sans-serif';

/* ── Médias ────────────────────────────────────────────────── */

const BASE = "https://www.maison-f-restaurant-nice.fr/websites/537be08ca3e6cf888ba897a7a40f725b/img/";

const PHOTOS = {
  gal1: BASE + "accueilgal1_20240130153500.png",
  gal2: BASE + "accueilgal2_20240130153502.png",
  gal3: BASE + "accueilgal3_20240130153504.png",
  gal4: BASE + "accueilgal4_20240130164108.png",
  duo1: BASE + "accueilduo1_20240130153538.png",
  degustation: BASE + "accueildegustation_20240130153603.png",
};

const LOGO_FOOTER = BASE + "logo-footer.png";
const LOGO_MENU = BASE + "logo-menu.png";

/* ── Types ─────────────────────────────────────────────────── */

type ScreenId = "accueil" | "experience" | "reservation" | "matable" | "apres";

type ReservMode = "table" | "evenement";

/* ── Composant principal ────────────────────────────────────── */

function MaisonF() {
  const [screen, setScreen] = useState<ScreenId>("accueil");

  // Réservation — mode table
  const [date, setDate] = useState("2025-07-11");
  const [service, setService] = useState("Dîner (19h30)");
  const [couverts, setCouverts] = useState(4);
  const [nom, setNom] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [allergies, setAllergies] = useState("");
  const [occasion, setOccasion] = useState("Aucune");
  const [tableFormSent, setTableFormSent] = useState(false);
  const [tableFormTouched, setTableFormTouched] = useState(false);

  // Réservation — mode événement
  const [evtType, setEvtType] = useState("");
  const [evtDate, setEvtDate] = useState("");
  const [evtPersonnes, setEvtPersonnes] = useState("");
  const [evtContact, setEvtContact] = useState("");
  const [evtWhatsapp, setEvtWhatsapp] = useState("");
  const [evtMessage, setEvtMessage] = useState("");
  const [evtFormSent, setEvtFormSent] = useState(false);
  const [evtFormTouched, setEvtFormTouched] = useState(false);

  const [reservMode, setReservMode] = useState<ReservMode>("table");

  // Ma Table
  const [tableAction, setTableAction] = useState<null | "retard" | "modifier" | "annuler">(null);

  // Après
  const [favori, setFavori] = useState<string | null>(null);
  const [newsletter, setNewsletter] = useState(false);
  const [avisClicked, setAvisClicked] = useState(false);

  // Navigation vers écran réservation en mode événement (depuis écran 5)
  const goReservEvent = () => {
    setReservMode("evenement");
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
        background: C.bleuNuit,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "16px 0",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap"
      />
      <div
        style={{
          width: 390,
          maxWidth: "100%",
          background: C.blanc,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
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
              tableState={{
                date, service, couverts, nom, whatsapp, allergies, occasion,
                tableFormSent, tableFormTouched,
              }}
              tableSet={{
                setDate, setService, setCouverts, setNom, setWhatsapp,
                setAllergies, setOccasion, setTableFormSent, setTableFormTouched,
              }}
              evtState={{
                evtType, evtDate, evtPersonnes, evtContact, evtWhatsapp,
                evtMessage, evtFormSent, evtFormTouched,
              }}
              evtSet={{
                setEvtType, setEvtDate, setEvtPersonnes, setEvtContact,
                setEvtWhatsapp, setEvtMessage, setEvtFormSent, setEvtFormTouched,
              }}
            />
          )}
          {screen === "matable" && (
            <MaTable go={go} tableAction={tableAction} setTableAction={setTableAction} />
          )}
          {screen === "apres" && (
            <Apres
              go={go}
              goReservEvent={goReservEvent}
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
    accueil: "",
    experience: "L'Expérience",
    reservation: "Réservation",
    matable: "Ma Table",
    apres: "Après le Repas",
  };
  return (
    <div
      style={{
        background: C.bleuNuit,
        padding: "18px 22px 14px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <SafeLogoImg
          src={LOGO_FOOTER}
          style={{ height: 38, width: 38, objectFit: "contain" }}
          fallbackStyle={{
            height: 38,
            width: 38,
            borderRadius: 8,
            background: C.or,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: C.bleuNuit,
            fontWeight: 700,
          }}
          fallbackText="MF"
        />
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 19,
              letterSpacing: "0.22em",
              color: C.blanc,
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}
          >
            Maison F
          </div>
          <div
            style={{
              fontSize: 8.5,
              letterSpacing: "0.38em",
              color: C.or,
              textTransform: "uppercase",
              marginTop: 3,
            }}
          >
            Nice · Par amour du frais
          </div>
        </div>
      </div>
      {titles[screen] ? (
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 14,
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
    { id: "accueil", label: "Accueil", icon: "⌂" },
    { id: "experience", label: "La Carte", icon: "❧" },
    { id: "reservation", label: "Réserver", icon: "✎" },
    { id: "matable", label: "Ma Table", icon: "◈" },
    { id: "apres", label: "Après", icon: "✦" },
  ];
  return (
    <div
      style={{
        display: "flex",
        background: C.bleuNuitDark,
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
              color: active ? C.bleuNuitDark : "#7A8FA0",
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
        background: "rgba(27,42,59,0.92)",
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
      {/* Hero image */}
      <div style={{ position: "relative" }}>
        <SafeImg
          src={PHOTOS.gal1}
          alt="Maison F · Terrasse face au port de Nice"
          style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
          fallbackStyle={{
            width: "100%",
            height: 220,
            background: `linear-gradient(150deg, ${C.bleuNuit} 0%, ${C.bleuNuitLight} 50%, ${C.or} 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(27,42,59,0.15) 0%, rgba(27,42,59,0.6) 100%)",
          }}
        />
        <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 21,
              color: "#fff",
              fontWeight: 700,
              lineHeight: 1.25,
              textShadow: "0 2px 10px rgba(0,0,0,0.55)",
            }}
          >
            Cuisine de marché.
            <br />
            Vue sur le port.
            <br />
            Chaque plat, une création maison.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 10,
            fontSize: 7.5,
            color: "rgba(255,255,255,0.6)",
            fontStyle: "italic",
          }}
        >
          © Maison F Nice — votre visuel dans votre application
        </div>
      </div>

      <div style={{ padding: "20px 22px 0" }}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 14.5,
            color: C.gris,
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          Mickael et son équipe vous accueillent du lundi au dimanche (sauf mardi)
        </p>

        {/* Carte réservation fictive */}
        <div
          style={{
            marginTop: 18,
            background: C.bleuNuit,
            borderRadius: 14,
            padding: "16px 18px",
            borderLeft: `4px solid ${C.or}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -22,
              right: -22,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: C.or,
              opacity: 0.1,
            }}
          />
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: C.or,
              marginBottom: 7,
            }}
          >
            Votre réservation
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 19,
              color: C.blanc,
              fontWeight: 600,
            }}
          >
            Vendredi 11 juillet · 20h00
          </div>
          <div style={{ fontSize: 12.5, color: "#A8B8C8", marginTop: 4 }}>
            Table pour 4 · Sophie
          </div>
        </div>

        {/* CTAs */}
        <div style={{ marginTop: 18, display: "grid", gap: 11 }}>
          <PrimaryButton onClick={() => go("reservation")}>
            Réserver ma table
          </PrimaryButton>
          <GhostButton onClick={() => go("experience")}>
            Découvrir l'expérience
          </GhostButton>
        </div>

        {/* Info localisation */}
        <div
          style={{
            marginTop: 20,
            padding: "14px 16px",
            background: C.blancDeep,
            borderRadius: 12,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <div style={{ fontSize: 20, lineHeight: 1 }}>⚓</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.encre, marginBottom: 2 }}>
              8 Quai des Docks · Nice
            </div>
            <div style={{ fontSize: 11.5, color: C.gris, lineHeight: 1.4 }}>
              Lun, Mer–Dim · 10h–23h · Terrasse privatisable
            </div>
            <div style={{ fontSize: 11.5, color: C.or, marginTop: 4, fontWeight: 600 }}>
              ★ 4.6 · 1 042 avis Google
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Écran 2 — L'Expérience ────────────────────────────────── */

type Cat = "Tous" | "Entrées" | "Poissons" | "Viandes" | "Végétarien" | "Desserts";

const FILTERS: Cat[] = ["Tous", "Entrées", "Poissons", "Viandes", "Végétarien", "Desserts"];

type Plat = {
  cat: Exclude<Cat, "Tous">;
  nom: string;
  desc: string;
  prix: number;
};

const PLATS: Plat[] = [
  { cat: "Entrées", nom: "Caprese du chef", desc: "pistou et crème de balsamique", prix: 13 },
  { cat: "Entrées", nom: "Tiradito de saumon", desc: "sauce maracuja", prix: 15 },
  { cat: "Entrées", nom: "Soupe de poisson", desc: "rouille maison, croûtons", prix: 14 },
  { cat: "Entrées", nom: "Salade César Maison F", desc: "poulet croustillant, œuf mollet", prix: 13 },
  { cat: "Poissons", nom: "Filet de daurade", desc: "légumes de saison, vierge aux herbes", prix: 26 },
  { cat: "Poissons", nom: "Saint-Pierre", desc: "beurre blanc au citron vert, fenouil", prix: 28 },
  { cat: "Viandes", nom: "Entrecôte de bœuf", desc: "sauce au poivre, frites maison", prix: 26 },
  { cat: "Viandes", nom: "Magret de canard", desc: "réduction balsamique, figues", prix: 28 },
  { cat: "Viandes", nom: "Côte d'agneau", desc: "jus corsé, gratin dauphinois", prix: 32 },
  { cat: "Végétarien", nom: "Risotto aux champignons sauvages", desc: "parmesan affiné", prix: 22 },
  { cat: "Végétarien", nom: "Tarte fine aux légumes du soleil", desc: "pesto maison", prix: 19 },
  { cat: "Desserts", nom: "Moelleux chocolat", desc: "glace vanille maison", prix: 12 },
  { cat: "Desserts", nom: "Panna cotta à la fleur d'oranger", desc: "coulis fraise", prix: 11 },
  { cat: "Desserts", nom: "Mille-feuille caramel beurre salé", desc: "crème légère vanille", prix: 13 },
];

function Experience({ go }: { go: (s: ScreenId) => void }) {
  const [activeFilter, setActiveFilter] = useState<Cat>("Tous");

  const visible = activeFilter === "Tous" ? PLATS : PLATS.filter((p) => p.cat === activeFilter);

  return (
    <div style={{ paddingBottom: 28 }}>
      {/* Bandeau Menu Dégustation */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.bleuNuit} 0%, ${C.bleuNuitLight} 100%)`,
          padding: "20px 20px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: C.or,
            opacity: 0.08,
          }}
        />
        <div
          style={{
            background: `linear-gradient(135deg, ${C.bleuNuitDark}, ${C.bleuNuit})`,
            border: `1.5px solid ${C.or}`,
            borderRadius: 16,
            padding: "18px 18px 0",
            marginBottom: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 8.5,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: C.or,
              marginBottom: 5,
              fontWeight: 700,
            }}
          >
            ★ Menu Découverte — L'expérience Maison F
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 20,
              color: C.blanc,
              fontWeight: 700,
              marginBottom: 6,
              lineHeight: 1.2,
            }}
          >
            7 plats signature
          </div>
          <div style={{ fontSize: 12, color: "#A8B8C8", lineHeight: 1.45, marginBottom: 12 }}>
            Accords mets et vins · sur commande
          </div>

          {/* Photo dégustation */}
          <div style={{ borderRadius: "10px 10px 0 0", overflow: "hidden", position: "relative" }}>
            <SafeImg
              src={PHOTOS.degustation}
              alt="Menu dégustation Maison F"
              style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
              fallbackStyle={{
                width: "100%",
                height: 130,
                background: `linear-gradient(135deg, ${C.bleuNuitLight}, ${C.orDark})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 6,
                right: 8,
                fontSize: 7.5,
                color: "rgba(255,255,255,0.6)",
                fontStyle: "italic",
              }}
            >
              © Maison F Nice — votre visuel dans votre application
            </div>
          </div>
        </div>

        {/* Prix et CTA sous la photo, toujours dans le bandeau */}
        <div
          style={{
            background: C.bleuNuitDark,
            border: `1.5px solid ${C.or}`,
            borderTop: "none",
            borderRadius: "0 0 16px 16px",
            padding: "14px 18px 18px",
            marginBottom: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: "#8AAABB", marginBottom: 2 }}>
              Par personne
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 28,
                color: C.or,
                fontWeight: 700,
              }}
            >
              115<span style={{ fontSize: 16 }}>€</span>
            </div>
          </div>
          <button
            onClick={() => go("reservation")}
            style={{
              padding: "12px 18px",
              borderRadius: 10,
              border: "none",
              background: C.or,
              color: C.bleuNuitDark,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: SANS,
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            Réserver le Menu Découverte
          </button>
        </div>
      </div>

      {/* Filtres carte */}
      <div
        style={{
          overflowX: "auto",
          display: "flex",
          gap: 8,
          padding: "4px 18px 14px",
          scrollbarWidth: "none",
        }}
      >
        {FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "8px 14px",
                borderRadius: 22,
                border: active ? `1.5px solid ${C.or}` : `1px solid ${C.line}`,
                background: active ? C.or : "#fff",
                color: active ? C.bleuNuitDark : C.gris,
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.18s",
                fontFamily: SANS,
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Liste des plats */}
      <div style={{ padding: "0 18px" }}>
        <div style={{ display: "grid", gap: 10 }}>
          {visible.map((p, i) => (
            <div
              key={`${p.cat}-${i}`}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "14px 15px",
                border: `1px solid ${C.line}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ flex: 1 }}>
                {activeFilter === "Tous" && (
                  <div
                    style={{
                      fontSize: 8,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: C.bleuNuitLight,
                      marginBottom: 3,
                      fontWeight: 600,
                    }}
                  >
                    {p.cat}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 14.5,
                    color: C.encre,
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  {p.nom}
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    fontSize: 11.5,
                    color: C.gris,
                    marginTop: 3,
                  }}
                >
                  {p.desc}
                </div>
                <div
                  style={{
                    marginTop: 7,
                    display: "inline-block",
                    background: C.saugeBg,
                    color: C.sauge,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    padding: "2px 8px",
                    borderRadius: 10,
                    textTransform: "uppercase",
                  }}
                >
                  ✓ Fait maison
                </div>
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 18,
                  color: C.bleuNuit,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {p.prix}€
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <PrimaryButton onClick={() => go("reservation")}>
            Réserver ma table
          </PrimaryButton>
        </div>
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
}: {
  go: (s: ScreenId) => void;
  reservMode: ReservMode;
  setReservMode: (m: ReservMode) => void;
  tableState: {
    date: string; service: string; couverts: number; nom: string;
    whatsapp: string; allergies: string; occasion: string;
    tableFormSent: boolean; tableFormTouched: boolean;
  };
  tableSet: {
    setDate: (v: string) => void; setService: (v: string) => void;
    setCouverts: (v: number) => void; setNom: (v: string) => void;
    setWhatsapp: (v: string) => void; setAllergies: (v: string) => void;
    setOccasion: (v: string) => void; setTableFormSent: (v: boolean) => void;
    setTableFormTouched: (v: boolean) => void;
  };
  evtState: {
    evtType: string; evtDate: string; evtPersonnes: string;
    evtContact: string; evtWhatsapp: string; evtMessage: string;
    evtFormSent: boolean; evtFormTouched: boolean;
  };
  evtSet: {
    setEvtType: (v: string) => void; setEvtDate: (v: string) => void;
    setEvtPersonnes: (v: string) => void; setEvtContact: (v: string) => void;
    setEvtWhatsapp: (v: string) => void; setEvtMessage: (v: string) => void;
    setEvtFormSent: (v: boolean) => void; setEvtFormTouched: (v: boolean) => void;
  };
}) {
  return (
    <div style={{ paddingBottom: 28 }}>
      {/* En-tête fixe */}
      <div
        style={{
          background: C.bleuNuit,
          padding: "14px 22px 16px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 13.5,
            fontStyle: "italic",
            color: "#A8B8C8",
            marginBottom: 14,
          }}
        >
          Face au port de Nice · 8 Quai des Docks
        </div>
        {/* Toggle */}
        <div
          style={{
            display: "flex",
            background: C.bleuNuitDark,
            borderRadius: 12,
            padding: 4,
            gap: 4,
          }}
        >
          {(["table", "evenement"] as ReservMode[]).map((mode) => {
            const active = reservMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setReservMode(mode)}
                style={{
                  flex: 1,
                  padding: "10px 8px",
                  borderRadius: 9,
                  border: "none",
                  background: active ? C.or : "transparent",
                  color: active ? C.bleuNuitDark : "#7A8FA0",
                  fontSize: 12.5,
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.22s",
                  fontFamily: SANS,
                }}
              >
                {mode === "table" ? "Ma table" : "Événement / Privatisation"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulaire selon mode */}
      {reservMode === "table" ? (
        <ReservTable go={go} state={tableState} set={tableSet} />
      ) : (
        <ReservEvenement go={go} state={evtState} set={evtSet} />
      )}
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
    date: string; service: string; couverts: number; nom: string;
    whatsapp: string; allergies: string; occasion: string;
    tableFormSent: boolean; tableFormTouched: boolean;
  };
  set: {
    setDate: (v: string) => void; setService: (v: string) => void;
    setCouverts: (v: number) => void; setNom: (v: string) => void;
    setWhatsapp: (v: string) => void; setAllergies: (v: string) => void;
    setOccasion: (v: string) => void; setTableFormSent: (v: boolean) => void;
    setTableFormTouched: (v: boolean) => void;
  };
}) {
  const {
    date, service, couverts, nom, whatsapp, allergies, occasion,
    tableFormSent, tableFormTouched,
  } = state;
  const {
    setDate, setService, setCouverts, setNom, setWhatsapp,
    setAllergies, setOccasion, setTableFormSent, setTableFormTouched,
  } = set;

  const nomErr = tableFormTouched && !nom.trim();
  const wappErr = tableFormTouched && !whatsapp.trim();
  const serviceErr = tableFormTouched && !service;
  const valid = nom.trim() && whatsapp.trim() && service && date;

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
            color: C.bleuNuitDark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            marginBottom: 22,
            boxShadow: `0 8px 24px rgba(201,168,76,0.45)`,
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
          Parfait {nom.split(" ")[0] || "Sophie"},
        </div>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 14.5,
            color: C.gris,
            lineHeight: 1.55,
            marginTop: 12,
            maxWidth: 300,
          }}
        >
          votre table du vendredi 11 juillet à 20h00 est confirmée. Un message WhatsApp de confirmation vous sera envoyé dans quelques instants.
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
            color: C.gris,
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
      {/* 1. Date */}
      <Field label="1 · Date souhaitée">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle()}
        />
      </Field>

      {/* 2. Service */}
      <Field label="2 · Service" error={serviceErr ? "Choisissez un service" : ""}>
        <div style={{ display: "flex", gap: 10 }}>
          {["Déjeuner (12h00)", "Dîner (19h30)"].map((s) => {
            const sel = service === s;
            return (
              <button
                key={s}
                onClick={() => setService(s)}
                style={{
                  flex: 1,
                  padding: "12px 6px",
                  borderRadius: 10,
                  border: sel
                    ? `1.5px solid ${C.or}`
                    : serviceErr
                    ? `1.5px solid #E05A5A`
                    : `1px solid ${C.line}`,
                  background: sel ? C.or : "#fff",
                  color: sel ? C.bleuNuitDark : C.gris,
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

      {/* 3. Couverts */}
      <Field label="3 · Nombre de couverts">
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {[1, 2, 3, 4, 5, 6, 7, "8+"].map((n) => {
            const sel = couverts === n || (n === "8+" && couverts >= 8);
            return (
              <button
                key={n}
                onClick={() => setCouverts(n === "8+" ? 8 : (n as number))}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 9,
                  border: sel ? `1.5px solid ${C.or}` : `1px solid ${C.line}`,
                  background: sel ? C.or : "#fff",
                  color: sel ? C.bleuNuitDark : C.gris,
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

      {/* 4. Nom */}
      <Field label="4 · Prénom et nom" error={nomErr ? "Ce champ est requis" : ""}>
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Sophie Martin"
          style={inputStyle(nomErr)}
        />
      </Field>

      {/* 5. WhatsApp */}
      <Field
        label="5 · Numéro WhatsApp"
        sublabel="Pour votre confirmation et rappel"
        error={wappErr ? "Ce champ est requis" : ""}
      >
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="+33 6 12 34 56 78"
          type="tel"
          style={inputStyle(wappErr)}
        />
      </Field>

      {/* 6. Allergies */}
      <Field label="6 · Allergies ou restrictions">
        <textarea
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="Sans gluten, végétarien, allergie fruits de mer… ou rien"
          rows={3}
          style={{
            ...inputStyle(),
            resize: "none",
            lineHeight: 1.45,
          }}
        />
      </Field>

      {/* 7. Occasion */}
      <Field label="7 · Occasion">
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {["Aucune", "Anniversaire", "Repas d'affaires", "Menu Découverte 7 plats", "Autre"].map(
            (opt) => {
              const sel = occasion === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setOccasion(opt)}
                  style={{
                    padding: "9px 13px",
                    borderRadius: 22,
                    border: sel ? `1.5px solid ${C.or}` : `1px solid ${C.line}`,
                    background: sel ? C.or : "#fff",
                    color: sel ? C.bleuNuitDark : C.gris,
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
            }
          )}
        </div>
      </Field>

      <div style={{ marginTop: 10 }}>
        <PrimaryButton
          onClick={() => {
            setTableFormTouched(true);
            if (valid) setTableFormSent(true);
          }}
        >
          Confirmer ma table
        </PrimaryButton>
        {tableFormTouched && !valid && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#E05A5A", textAlign: "center" }}>
            Veuillez remplir les champs nom, WhatsApp et service.
          </div>
        )}
      </div>
    </div>
  );
}

/* Mode "Événement / Privatisation" */
function ReservEvenement({
  go,
  state,
  set,
}: {
  go: (s: ScreenId) => void;
  state: {
    evtType: string; evtDate: string; evtPersonnes: string;
    evtContact: string; evtWhatsapp: string; evtMessage: string;
    evtFormSent: boolean; evtFormTouched: boolean;
  };
  set: {
    setEvtType: (v: string) => void; setEvtDate: (v: string) => void;
    setEvtPersonnes: (v: string) => void; setEvtContact: (v: string) => void;
    setEvtWhatsapp: (v: string) => void; setEvtMessage: (v: string) => void;
    setEvtFormSent: (v: boolean) => void; setEvtFormTouched: (v: boolean) => void;
  };
}) {
  const {
    evtType, evtDate, evtPersonnes, evtContact, evtWhatsapp,
    evtMessage, evtFormSent, evtFormTouched,
  } = state;
  const {
    setEvtType, setEvtDate, setEvtPersonnes, setEvtContact,
    setEvtWhatsapp, setEvtMessage, setEvtFormSent, setEvtFormTouched,
  } = set;

  const contactErr = evtFormTouched && !evtContact.trim();
  const wappErr = evtFormTouched && !evtWhatsapp.trim();
  const typeErr = evtFormTouched && !evtType;
  const valid = evtType && evtDate && evtContact.trim() && evtWhatsapp.trim();

  if (evtFormSent) {
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
            background: C.sauge,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            marginBottom: 22,
            boxShadow: `0 8px 24px rgba(122,158,126,0.45)`,
          }}
        >
          ✓
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 22,
            color: C.encre,
            lineHeight: 1.3,
            fontWeight: 600,
          }}
        >
          Merci {evtContact.split(" ")[0] || "Sophie"},
        </div>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 14.5,
            color: C.gris,
            lineHeight: 1.55,
            marginTop: 12,
            maxWidth: 300,
          }}
        >
          votre demande d'événement a bien été transmise à l'équipe Maison F. Nous vous recontactons sous 24h pour construire ensemble votre moment.
        </p>
        <button
          onClick={() => setEvtFormSent(false)}
          style={{
            marginTop: 16,
            background: "none",
            border: "none",
            color: C.gris,
            fontSize: 12,
            textDecoration: "underline",
            cursor: "pointer",
            fontFamily: SANS,
          }}
        >
          Modifier ma demande
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 22px 28px" }}>
      {/* Photo terrasse */}
      <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 18, position: "relative" }}>
        <SafeImg
          src={PHOTOS.duo1}
          alt="Terrasse Maison F face au port"
          style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }}
          fallbackStyle={{
            width: "100%",
            height: 110,
            background: `linear-gradient(135deg, ${C.bleuNuit}, ${C.bleuNuitLight})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 6,
            right: 8,
            fontSize: 7.5,
            color: "rgba(255,255,255,0.6)",
            fontStyle: "italic",
          }}
        >
          © Maison F Nice — votre visuel dans votre application
        </div>
      </div>

      {/* 1. Type d'événement */}
      <Field label="1 · Type d'événement" error={typeErr ? "Choisissez un type" : ""}>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {["Anniversaire", "Séminaire", "Team Building", "Cocktail", "Privatisation terrasse", "Autre"].map(
            (opt) => {
              const sel = evtType === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setEvtType(opt)}
                  style={{
                    padding: "9px 13px",
                    borderRadius: 22,
                    border: sel
                      ? `1.5px solid ${C.or}`
                      : typeErr
                      ? `1.5px solid #E05A5A`
                      : `1px solid ${C.line}`,
                    background: sel ? C.or : "#fff",
                    color: sel ? C.bleuNuitDark : C.gris,
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
            }
          )}
        </div>
      </Field>

      {/* 2. Date */}
      <Field label="2 · Date souhaitée">
        <input type="date" value={evtDate} onChange={(e) => setEvtDate(e.target.value)} style={inputStyle()} />
      </Field>

      {/* 3. Nombre de personnes */}
      <Field label="3 · Nombre de personnes">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["10–20", "20–50", "50–100", "100–200", "200+"].map((n) => {
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
                  color: sel ? C.bleuNuitDark : C.gris,
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

      {/* 4. Contact */}
      <Field label="4 · Prénom, nom et société" error={contactErr ? "Ce champ est requis" : ""}>
        <input
          value={evtContact}
          onChange={(e) => setEvtContact(e.target.value)}
          placeholder="Sophie Martin · Société XYZ"
          style={inputStyle(contactErr)}
        />
      </Field>

      {/* 5. WhatsApp */}
      <Field label="5 · Numéro WhatsApp" error={wappErr ? "Ce champ est requis" : ""}>
        <input
          value={evtWhatsapp}
          onChange={(e) => setEvtWhatsapp(e.target.value)}
          placeholder="+33 6 12 34 56 78"
          type="tel"
          style={inputStyle(wappErr)}
        />
      </Field>

      {/* 6. Message */}
      <Field label="6 · Votre projet">
        <textarea
          value={evtMessage}
          onChange={(e) => setEvtMessage(e.target.value)}
          placeholder="Décrivez votre projet en quelques mots"
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
          <div style={{ marginTop: 10, fontSize: 12, color: "#E05A5A", textAlign: "center" }}>
            Veuillez remplir les champs type, date, contact et WhatsApp.
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
      {/* Carte réservation bleu nuit */}
      <div
        style={{
          background: C.bleuNuit,
          borderRadius: 16,
          padding: "20px 20px 22px",
          position: "relative",
          overflow: "hidden",
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
            opacity: 0.1,
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
            color: C.blanc,
            fontWeight: 600,
            lineHeight: 1.25,
          }}
        >
          Vendredi 11 juillet · 20h00
        </div>
        <div style={{ fontSize: 13, color: "#A8B8C8", marginTop: 5 }}>
          Table pour 4 · Sophie
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "#7A8FA0" }}>📍</div>
          <div style={{ fontSize: 12, color: "#7A8FA0" }}>
            8 Quai des Docks, Nice · Vue sur le port
          </div>
        </div>
      </div>

      {/* Banners */}
      {tableAction === "retard" && (
        <Banner tone="ok">
          Retard signalé à l'équipe Maison F, merci.
        </Banner>
      )}
      {tableAction === "modifier" && (
        <Banner tone="neutral">
          Demande de modification transmise. L'équipe vous recontacte sous peu.
        </Banner>
      )}
      {tableAction === "annuler" && (
        <Banner tone="neutral">
          Annulation enregistrée. Merci de nous avoir prévenus — la table est libérée pour un autre convive.
        </Banner>
      )}

      {/* 3 actions */}
      <div style={{ marginTop: 16, display: "grid", gap: 9 }}>
        <button
          onClick={() => setTableAction("retard")}
          style={actionBtn(tableAction === "retard")}
        >
          ⏱ Prévenir d'un retard
        </button>
        <div style={{ display: "flex", gap: 9 }}>
          <button
            onClick={() => setTableAction("modifier")}
            style={{ ...actionBtn(tableAction === "modifier"), flex: 1 }}
          >
            ✎ Modifier
          </button>
          <button
            onClick={() => setTableAction("annuler")}
            style={{ ...actionBtn(tableAction === "annuler"), flex: 1 }}
          >
            ✕ Annuler
          </button>
        </div>
        {tableAction && (
          <button
            onClick={() => setTableAction(null)}
            style={{
              background: "none",
              border: "none",
              color: C.gris,
              fontSize: 12,
              textDecoration: "underline",
              cursor: "pointer",
              fontFamily: SANS,
              padding: "4px 0",
            }}
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
          background: C.saugeBg,
          borderRadius: 12,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          border: `1px solid ${C.sauge}30`,
        }}
      >
        <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>💬</div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.sauge, marginBottom: 3 }}>
            Rappel WhatsApp
          </div>
          <div style={{ fontSize: 12, color: "#4A7C4E", lineHeight: 1.4 }}>
            Un rappel vous sera envoyé demain à 18h sur votre WhatsApp +33 6 XX XX XX XX
          </div>
        </div>
      </div>

      {/* Bloc terrasse */}
      <div
        style={{
          marginTop: 14,
          padding: "15px 16px",
          background: C.blancDeep,
          borderRadius: 12,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            background: C.bleuNuit,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: C.or,
            flexShrink: 0,
          }}
        >
          ⚓
        </div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.encre, marginBottom: 3 }}>
            Table en terrasse
          </div>
          <div style={{ fontSize: 12, color: C.gris, lineHeight: 1.4 }}>
            Vue directe sur le port et la colline du château — une table face aux bateaux.
          </div>
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
  goReservEvent,
  favori,
  setFavori,
  newsletter,
  setNewsletter,
  avisClicked,
  setAvisClicked,
}: {
  go: (s: ScreenId) => void;
  goReservEvent: () => void;
  favori: string | null;
  setFavori: (s: string) => void;
  newsletter: boolean;
  setNewsletter: (b: boolean) => void;
  avisClicked: boolean;
  setAvisClicked: (b: boolean) => void;
}) {
  return (
    <div style={{ padding: "22px 22px 28px" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 22,
            color: C.encre,
            fontWeight: 600,
          }}
        >
          Merci d'avoir choisi Maison F
        </div>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 14,
            color: C.gris,
            margin: "10px 0 0",
            lineHeight: 1.55,
          }}
        >
          "Par amour du frais, chaque repas est une promesse renouvelée."
        </p>
      </div>

      {/* Coup de cœur */}
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.bleuNuit,
            marginBottom: 10,
            fontWeight: 700,
          }}
        >
          Votre coup de cœur ce soir ?
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Entrée", "Plat", "Dessert", "L'ambiance terrasse", "Le service"].map((label) => {
            const sel = favori === label;
            return (
              <button
                key={label}
                onClick={() => setFavori(label)}
                style={{
                  padding: "9px 13px",
                  borderRadius: 22,
                  border: sel ? `1.5px solid ${C.bleuNuit}` : `1px solid ${C.line}`,
                  background: sel ? C.bleuNuit : "#fff",
                  color: sel ? C.blanc : C.gris,
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

      {/* Message spécial terrasse */}
      {favori === "L'ambiance terrasse" && (
        <div
          style={{
            padding: "16px 18px",
            background: C.bleuNuit,
            borderRadius: 14,
            marginBottom: 16,
            border: `1px solid ${C.or}`,
          }}
        >
          <div style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: C.or, marginBottom: 6 }}>
            ⚓ Privatisation terrasse
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 15,
              color: C.blanc,
              lineHeight: 1.4,
              marginBottom: 12,
            }}
          >
            La terrasse Maison F est privatisable pour vos événements. Faites-en un moment inoubliable.
          </div>
          <button
            onClick={goReservEvent}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: 9,
              border: "none",
              background: C.or,
              color: C.bleuNuitDark,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: SANS,
            }}
          >
            Organiser un événement
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
        <div style={{ fontSize: 12.5, color: C.gris, marginBottom: 10, lineHeight: 1.4 }}>
          Votre avis aide Mickael et son équipe
        </div>
        <button
          onClick={() => setAvisClicked(true)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: avisClicked ? C.sauge : C.bleuNuit,
            color: "#fff",
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

      {/* Newsletter */}
      <div
        style={{
          padding: "18px 18px",
          background: C.bleuNuit,
          borderRadius: 14,
          color: C.blanc,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: C.or,
            marginBottom: 4,
          }}
        >
          ✦ Par amour du frais
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          La sélection du marché
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#A8B8C8",
            lineHeight: 1.5,
            margin: "0 0 14px",
          }}
        >
          Recevez chaque semaine les arrivages du chef, les plats du moment, la sélection du marché.
        </p>
        <button
          onClick={() => setNewsletter(!newsletter)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: newsletter ? C.or : C.bleuNuitLight,
            color: newsletter ? C.bleuNuitDark : C.blanc,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.02em",
            transition: "all 0.25s",
            fontFamily: SANS,
          }}
        >
          {newsletter ? "✓ Vous êtes abonné" : "Recevoir la sélection hebdomadaire"}
        </button>
      </div>

      <PrimaryButton onClick={() => go("reservation")}>
        Réserver ma prochaine table
      </PrimaryButton>

      <div
        style={{
          marginTop: 24,
          textAlign: "center",
          borderTop: `1px solid ${C.line}`,
          paddingTop: 16,
        }}
      >
        <div style={{ fontSize: 10.5, color: C.gris, lineHeight: 1.5 }}>
          Démonstration personnalisable · ByCo Systems · bycosystems.xyz
        </div>
        <div
          style={{
            fontSize: 9.5,
            color: "#AAA",
            marginTop: 4,
            fontStyle: "italic",
          }}
        >
          © Photos Maison F Nice — intégrées avec leur accord lors du déploiement final
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
        background: disabled ? C.blancDeep : C.or,
        color: disabled ? C.gris : C.bleuNuitDark,
        fontSize: 13.5,
        fontWeight: 700,
        letterSpacing: "0.02em",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: SANS,
        transition: "all 0.2s",
        boxShadow: disabled ? "none" : `0 4px 16px rgba(201,168,76,0.35)`,
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
        border: `1.5px solid ${C.bleuNuit}`,
        background: "transparent",
        color: C.bleuNuit,
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
          color: C.bleuNuit,
          fontWeight: 700,
          marginBottom: sublabel ? 2 : 9,
        }}
      >
        {label}
      </div>
      {sublabel && (
        <div
          style={{
            fontSize: 11,
            color: C.gris,
            marginBottom: 8,
            fontStyle: "italic",
          }}
        >
          {sublabel}
        </div>
      )}
      {children}
      {error && (
        <div style={{ fontSize: 11, color: "#E05A5A", marginTop: 5 }}>
          {error}
        </div>
      )}
    </div>
  );
}

function Banner({ children, tone }: { children: React.ReactNode; tone: "ok" | "neutral" }) {
  const bg = tone === "ok" ? C.saugeBg : C.blancDeep;
  const bd = tone === "ok" ? C.sauge : C.or;
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
    background: active ? C.blancDeep : "#fff",
    color: active ? C.bleuNuit : C.gris,
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
    border: hasError ? `1.5px solid #E05A5A` : `1px solid ${C.line}`,
    background: "#fff",
    fontSize: 13.5,
    color: C.encre,
    fontFamily: SANS,
    outline: "none",
  };
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
}: {
  src: string;
  style: React.CSSProperties;
  fallbackStyle: React.CSSProperties;
  fallbackText: string;
}) {
  const [error, setError] = useState(false);
  if (error) return <div style={fallbackStyle}>{fallbackText}</div>;
  return <img src={src} alt="Logo Maison F" onError={() => setError(true)} style={style} />;
}
