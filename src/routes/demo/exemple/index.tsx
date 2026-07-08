// ─────────────────────────────────────────────────────────────
// src/routes/demo/exemple/index.tsx
// "Éveil Digital" — démo mini-application générique pour Restaurant Exemple
// Conçue par ByCo Systems. Démonstration personnalisable, entièrement anonymisée.
//
// DÉPLOIEMENT :
//   1. Placer ce fichier dans  src/routes/demo/exemple/index.tsx
//   2. git add . && git commit && git push  → Cloudflare Pages déploie
//   3. URL publique : https://bycosystems.xyz/demo/exemple
//
// Pure front-end, aucune dépendance backend. TanStack Start + React + TS.
// Styles inline pour garantir un rendu identique à la démo validée.
// ─────────────────────────────────────────────────────────────

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/demo/exemple/")({
  component: EveillDigital,
  head: () => ({
    meta: [
      { title: "Restaurant Exemple · Éveil Digital × ByCo Systems" },
      {
        name: "description",
        content:
          "Démonstration interactive de la mini-application sur-mesure conçue par ByCo Systems, exemple générique pour un restaurant.",
      },
    ],
  }),
});

/* ── Palette ────────────────────────────────────────────────── */

const C = {
  ardoise: "#2C3E50",
  ardoiseDark: "#1E2D3D",
  ardoiseLight: "#3A5068",
  ocre: "#D4A853",
  ocreDark: "#B8902F",
  ocreLight: "#EEC97A",
  cream: "#F8F4EE",
  creamDeep: "#EDE8DF",
  terracotta: "#C17F5A",
  terracottaDeep: "#A06040",
  ink: "#1A1A1A",
  inkSoft: "#6B6560",
  line: "#DDD5C8",
  green: "#5A8C5A",
  greenBg: "#EAF2EA",
};

const SERIF = '"Playfair Display", "Cormorant Garamond", Georgia, serif';
const SANS = '"Inter", "Helvetica Neue", system-ui, sans-serif';

/* ── Emplacements visuels ──────────────────────────────────────
   Aucune photo ni logo réel : chaque emplacement image est
   remplacé par un bloc de texte descriptif sur fond uni,
   aux couleurs de la charte définie ci-dessus.
   ─────────────────────────────────────────────────────────── */

/* ── Types ─────────────────────────────────────────────────── */

type ScreenId = "accueil" | "carte" | "reservation" | "matable" | "apres";

/* ── Composant principal ────────────────────────────────────── */

function EveillDigital() {
  const [screen, setScreen] = useState<ScreenId>("accueil");

  // Formulaire réservation
  const [date, setDate] = useState("2025-07-08");
  const [service, setService] = useState("");
  const [couverts, setCouverts] = useState(2);
  const [nom, setNom] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [allergies, setAllergies] = useState("");
  const [occasion, setOccasion] = useState("Aucune");
  const [formSent, setFormSent] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // Ma Table
  const [tableAction, setTableAction] = useState<
    null | "retard" | "modifier" | "annuler"
  >(null);

  // Après le repas
  const [favori, setFavori] = useState<string | null>(null);
  const [newsletter, setNewsletter] = useState(false);

  const go = (s: ScreenId) => {
    setScreen(s);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  return (
    <div
      style={{
        fontFamily: SANS,
        background: C.ardoise,
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
          background: C.cream,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          position: "relative",
          minHeight: 780,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopBar screen={screen} />
        <div style={{ flex: 1, position: "relative" }}>
          {screen === "accueil" && <Accueil go={go} />}
          {screen === "carte" && <Carte go={go} />}
          {screen === "reservation" && (
            <Reservation
              go={go}
              state={{
                date,
                service,
                couverts,
                nom,
                whatsapp,
                allergies,
                occasion,
                formSent,
                formTouched,
              }}
              set={{
                setDate,
                setService,
                setCouverts,
                setNom,
                setWhatsapp,
                setAllergies,
                setOccasion,
                setFormSent,
                setFormTouched,
              }}
            />
          )}
          {screen === "matable" && (
            <MaTable
              go={go}
              tableAction={tableAction}
              setTableAction={setTableAction}
            />
          )}
          {screen === "apres" && (
            <Apres
              go={go}
              favori={favori}
              setFavori={setFavori}
              newsletter={newsletter}
              setNewsletter={setNewsletter}
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
    carte: "La Carte du Moment",
    reservation: "Réserver ma table",
    matable: "Ma Table",
    apres: "Après le Repas",
  };
  return (
    <div
      style={{
        background: C.ardoise,
        padding: "18px 22px 14px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 11 }}>
        <LogoPlaceholder
          style={{
            height: 36,
            width: 36,
            borderRadius: 6,
            background: C.ocre,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: C.ardoise,
            fontWeight: 700,
          }}
          text="RE"
        />
        <div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 18,
              letterSpacing: "0.18em",
              color: C.cream,
              fontWeight: 600,
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}
          >
            Restaurant Exemple
          </div>
          <div
            style={{
              fontSize: 8.5,
              letterSpacing: "0.38em",
              color: C.ocre,
              textTransform: "uppercase",
              marginTop: 3,
            }}
          >
            Cuisine de Marché
          </div>
        </div>
      </div>
      {titles[screen] ? (
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 14,
            fontStyle: "italic",
            color: C.ocreLight,
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

function NavBar({
  screen,
  go,
}: {
  screen: ScreenId;
  go: (s: ScreenId) => void;
}) {
  const items: { id: ScreenId; label: string; icon: string }[] = [
    { id: "accueil", label: "Accueil", icon: "⌂" },
    { id: "carte", label: "La Carte", icon: "❧" },
    { id: "reservation", label: "Réserver", icon: "✎" },
    { id: "matable", label: "Ma Table", icon: "◈" },
    { id: "apres", label: "Après", icon: "✦" },
  ];
  return (
    <div
      style={{
        display: "flex",
        background: C.ardoiseDark,
        borderTop: `2px solid ${C.ocre}`,
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
              background: active ? C.ocre : "transparent",
              color: active ? C.ardoiseDark : "#8A9BAD",
              padding: "10px 2px 9px",
              cursor: "pointer",
              transition: "all 0.22s",
            }}
          >
            <div style={{ fontSize: 14, lineHeight: 1 }}>{it.icon}</div>
            <div
              style={{
                fontSize: 8,
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
        background: "rgba(44,62,80,0.88)",
        color: C.ocre,
        fontSize: 7.5,
        letterSpacing: "0.12em",
        padding: "3px 8px",
        borderRadius: 20,
        textTransform: "uppercase",
        border: `1px solid ${C.ocre}`,
        fontWeight: 600,
      }}
    >
      Démo ByCo
    </div>
  );
}

/* ── Écran 1 — Accueil ────────────────────────────────────── */

function Accueil({ go }: { go: (s: ScreenId) => void }) {
  return (
    <div style={{ paddingBottom: 28 }}>
      {/* Hero image */}
      <div style={{ position: "relative" }}>
        <ImagePlaceholder
          label="Salle du restaurant"
          style={{
            width: "100%",
            height: 220,
            background: `linear-gradient(150deg, ${C.ardoise} 0%, ${C.terracotta} 60%, ${C.ocre} 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(44,62,80,0.18) 0%, rgba(44,62,80,0.55) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 14,
            right: 14,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 21,
              color: "#fff",
              fontWeight: 600,
              lineHeight: 1.25,
              textShadow: "0 2px 8px rgba(0,0,0,0.45)",
            }}
          >
            Cuisine de marché.
            <br />
            Saveurs méditerranéennes.
            <br />
            Tout fait maison.
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 22px 0" }}>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 15,
            color: C.inkSoft,
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          Cyrille et Céline vous accueillent du lundi au vendredi
        </p>

        {/* Carte réservation */}
        <div
          style={{
            marginTop: 18,
            background: C.ardoise,
            borderRadius: 14,
            padding: "16px 18px",
            borderLeft: `4px solid ${C.ocre}`,
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
              background: C.ocre,
              opacity: 0.12,
            }}
          />
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: C.ocre,
              marginBottom: 7,
            }}
          >
            Votre réservation
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 19,
              color: C.cream,
              fontWeight: 600,
            }}
          >
            Mardi 8 juillet · 19h30
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: "#A8B8C8",
              marginTop: 4,
            }}
          >
            Table pour 2 · Laurent
          </div>
        </div>

        {/* CTAs */}
        <div style={{ marginTop: 18, display: "grid", gap: 11 }}>
          <PrimaryButton onClick={() => go("reservation")}>
            Réserver ma table
          </PrimaryButton>
          <GhostButton onClick={() => go("carte")}>
            La carte du moment
          </GhostButton>
        </div>

        {/* Info */}
        <div
          style={{
            marginTop: 20,
            padding: "14px 16px",
            background: C.creamDeep,
            borderRadius: 12,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <div style={{ fontSize: 20, lineHeight: 1 }}>📍</div>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: C.ink,
                marginBottom: 2,
              }}
            >
              Votre adresse ici
            </div>
            <div style={{ fontSize: 11.5, color: C.inkSoft, lineHeight: 1.4 }}>
              Lun – Ven · Midi &amp; Soir · 65 couverts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Écran 2 — La Carte ─────────────────────────────────────── */

type Cat =
  | "Tous"
  | "Entrées"
  | "Poissons"
  | "Viandes"
  | "Végétarien"
  | "Desserts Céline";

const FILTERS: Cat[] = [
  "Tous",
  "Entrées",
  "Poissons",
  "Viandes",
  "Végétarien",
  "Desserts Céline",
];

type Plat = {
  cat: Exclude<Cat, "Tous">;
  nom: string;
  prix: number;
  desc?: string;
};

const PLATS: Plat[] = [
  {
    cat: "Entrées",
    nom: "Burrata crémeuse",
    desc: "tomates anciennes, basilic niçois",
    prix: 13,
  },
  {
    cat: "Entrées",
    nom: "Velouté de courgettes",
    desc: "fleur de courgette, huile d'olive",
    prix: 11,
  },
  {
    cat: "Entrées",
    nom: "Carpaccio de bœuf",
    desc: "roquette, parmesan",
    prix: 15,
  },
  {
    cat: "Poissons",
    nom: "Filet de rouget barbet",
    desc: "ratatouille niçoise, pistou",
    prix: 25,
  },
  {
    cat: "Poissons",
    nom: "Saint-Pierre meunière",
    desc: "câpres, citron, beurre noisette",
    prix: 28,
  },
  {
    cat: "Viandes",
    nom: "Magret de canard",
    desc: "figues rôties, miel de lavande",
    prix: 26,
  },
  {
    cat: "Viandes",
    nom: "Entrecôte grillée",
    desc: "sauce au poivre, frites maison",
    prix: 24,
  },
  {
    cat: "Végétarien",
    nom: "Risotto aux cèpes",
    desc: "parmesan, truffe d'été",
    prix: 22,
  },
  {
    cat: "Desserts Céline",
    nom: "Tarte fine aux abricots",
    desc: "crème d'amande",
    prix: 10,
  },
  {
    cat: "Desserts Céline",
    nom: "Moelleux au chocolat",
    desc: "glace vanille maison",
    prix: 9,
  },
  {
    cat: "Desserts Céline",
    nom: "Panna cotta à la lavande",
    desc: "coulis de fraise",
    prix: 8,
  },
  {
    cat: "Desserts Céline",
    nom: "Pain perdu brioché",
    desc: "caramel au beurre salé",
    prix: 9,
  },
];

function Carte({ go }: { go: (s: ScreenId) => void }) {
  const [activeFilter, setActiveFilter] = useState<Cat>("Tous");

  const visible =
    activeFilter === "Tous"
      ? PLATS
      : PLATS.filter((p) => p.cat === activeFilter);

  const showCeline = activeFilter === "Tous" || activeFilter === "Desserts Céline";

  return (
    <div style={{ paddingBottom: 28 }}>
      {/* Filtres */}
      <div
        style={{
          overflowX: "auto",
          display: "flex",
          gap: 8,
          padding: "16px 18px 12px",
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
                border: active
                  ? `1.5px solid ${C.ocre}`
                  : `1px solid ${C.line}`,
                background: active ? C.ocre : "#fff",
                color: active ? C.ardoiseDark : C.inkSoft,
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

      <div style={{ padding: "0 18px" }}>
        {/* Menu de la semaine */}
        {(activeFilter === "Tous") && (
          <div
            style={{
              background: C.ardoise,
              borderRadius: 16,
              padding: "18px 18px 20px",
              marginBottom: 18,
              position: "relative",
              overflow: "hidden",
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
                background: C.ocre,
                opacity: 0.15,
              }}
            />
            <div
              style={{
                fontSize: 8.5,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: C.ocre,
                marginBottom: 4,
              }}
            >
              Menu de la semaine
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 20,
                color: C.cream,
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              Sélection Cyrille
            </div>

            {/* Emplacement visuel dans le menu */}
            <div style={{ marginBottom: 14, borderRadius: 10, overflow: "hidden", position: "relative" }}>
              <ImagePlaceholder
                label="Plat de la semaine"
                style={{
                  width: "100%",
                  height: 120,
                  background: `linear-gradient(135deg, ${C.ardoiseLight}, ${C.terracotta})`,
                }}
              />
            </div>

            {[
              { label: "Entrée", nom: "Carpaccio de daurade", desc: "citron confit, herbes fraîches du marché", prix: "14€" },
              { label: "Plat", nom: "Agneau de Sisteron", desc: "jus corsé, légumes de saison", prix: "26€" },
              { label: "Dessert Céline", nom: "Tarte fine aux abricots", desc: "crème d'amande", prix: "10€" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  borderBottom: `1px solid rgba(248,244,238,0.12)`,
                  paddingBottom: 10,
                  marginBottom: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: C.ocre,
                      marginBottom: 2,
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: 13.5, color: C.cream, fontFamily: SERIF }}>
                    {item.nom}
                  </div>
                  <div style={{ fontSize: 11, color: "#A8B8C8", marginTop: 2 }}>
                    {item.desc}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 17,
                    color: C.ocre,
                    fontWeight: 600,
                    marginLeft: 12,
                    flexShrink: 0,
                  }}
                >
                  {item.prix}
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "#8AAABB" }}>Menu complet</div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 21,
                  color: C.ocre,
                  fontWeight: 700,
                }}
              >
                42€
              </div>
            </div>
          </div>
        )}

        {/* Desserts Céline encadré spécial */}
        {showCeline && activeFilter !== "Tous" && (
          <div
            style={{
              background: C.terracotta,
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 14,
              color: C.cream,
            }}
          >
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.88, marginBottom: 3 }}>
              ✦ Pâtisserie
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
              Fait maison par Céline, notre chef pâtissière
            </div>
          </div>
        )}

        {/* Liste des plats */}
        <div style={{ display: "grid", gap: 10 }}>
          {visible.map((p, i) => {
            const isCeline = p.cat === "Desserts Céline";
            return (
              <div
                key={`${p.cat}-${i}`}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: "14px 15px",
                  border: isCeline
                    ? `1.5px solid ${C.terracotta}`
                    : `1px solid ${C.line}`,
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
                        fontSize: 8.5,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: isCeline ? C.terracotta : C.inkSoft,
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
                      color: C.ink,
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {p.nom}
                  </div>
                  {p.desc && (
                    <div
                      style={{
                        fontSize: 11.5,
                        color: C.inkSoft,
                        marginTop: 3,
                        fontStyle: "italic",
                        fontFamily: SERIF,
                      }}
                    >
                      {p.desc}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 18,
                    color: C.ardoise,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {p.prix}€
                </div>
              </div>
            );
          })}
        </div>

        {/* Desserts Céline encadré (vue Tous) */}
        {activeFilter === "Tous" && (
          <div
            style={{
              marginTop: 16,
              background: `linear-gradient(135deg, ${C.terracottaDeep}, ${C.terracotta})`,
              borderRadius: 14,
              padding: "16px 18px",
              color: C.cream,
            }}
          >
            <div style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.85, marginBottom: 4 }}>
              ✦ Les desserts
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, marginBottom: 6 }}>
              Créations de Céline Billa
            </div>
            <div style={{ fontSize: 12, opacity: 0.88, lineHeight: 1.45 }}>
              Chaque dessert est imaginé et réalisé par Céline, notre chef pâtissière — de la tarte aux gâteaux, jusqu'au pain du jour.
            </div>
          </div>
        )}

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
  state,
  set,
}: {
  go: (s: ScreenId) => void;
  state: {
    date: string;
    service: string;
    couverts: number;
    nom: string;
    whatsapp: string;
    allergies: string;
    occasion: string;
    formSent: boolean;
    formTouched: boolean;
  };
  set: {
    setDate: (v: string) => void;
    setService: (v: string) => void;
    setCouverts: (v: number) => void;
    setNom: (v: string) => void;
    setWhatsapp: (v: string) => void;
    setAllergies: (v: string) => void;
    setOccasion: (v: string) => void;
    setFormSent: (v: boolean) => void;
    setFormTouched: (v: boolean) => void;
  };
}) {
  const {
    date, service, couverts, nom, whatsapp, allergies, occasion,
    formSent, formTouched,
  } = state;
  const {
    setDate, setService, setCouverts, setNom, setWhatsapp,
    setAllergies, setOccasion, setFormSent, setFormTouched,
  } = set;

  const nomErr = formTouched && !nom.trim();
  const wappErr = formTouched && !whatsapp.trim();
  const serviceErr = formTouched && !service;

  const valid = nom.trim() && whatsapp.trim() && service && date;

  if (formSent) {
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
            background: C.ocre,
            color: C.ardoiseDark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            marginBottom: 22,
            boxShadow: `0 8px 24px rgba(212,168,83,0.4)`,
          }}
        >
          ✓
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 24,
            color: C.ink,
            lineHeight: 1.3,
            fontWeight: 600,
          }}
        >
          Parfait {nom.split(" ")[0] || "Laurent"},
        </div>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 15,
            color: C.inkSoft,
            lineHeight: 1.55,
            marginTop: 12,
            maxWidth: 300,
          }}
        >
          votre table du mardi 8 juillet à 19h30 est confirmée. Cyrille vous attend.
        </p>
        <div
          style={{
            marginTop: 16,
            padding: "13px 16px",
            background: C.creamDeep,
            borderRadius: 12,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            textAlign: "left",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 18 }}>📱</div>
          <div style={{ fontSize: 12.5, color: C.inkSoft, lineHeight: 1.45 }}>
            Un message WhatsApp de confirmation va vous être envoyé dans quelques instants.
          </div>
        </div>
        <div style={{ marginTop: 24, width: "100%" }}>
          <PrimaryButton onClick={() => go("matable")}>
            Voir ma table
          </PrimaryButton>
        </div>
        <button
          onClick={() => setFormSent(false)}
          style={{
            marginTop: 12,
            background: "none",
            border: "none",
            color: C.inkSoft,
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
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 15,
          color: C.inkSoft,
          margin: "0 0 20px",
          lineHeight: 1.5,
        }}
      >
        Cyrille et son équipe vous attendent
      </p>

      {/* 1. Date */}
      <Field label="1 · Date souhaitée">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px",
            borderRadius: 10,
            border: `1px solid ${C.line}`,
            background: "#fff",
            fontSize: 13.5,
            color: C.ink,
            fontFamily: SANS,
            outline: "none",
          }}
        />
      </Field>

      {/* 2. Service */}
      <Field label="2 · Service" error={serviceErr ? "Choisissez un service" : ""}>
        <div style={{ display: "flex", gap: 10 }}>
          {["Midi (12h00)", "Soir (19h30)"].map((s) => {
            const sel = service === s;
            return (
              <button
                key={s}
                onClick={() => setService(s)}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  borderRadius: 10,
                  border: sel
                    ? `1.5px solid ${C.ocre}`
                    : serviceErr
                    ? `1.5px solid #E05A5A`
                    : `1px solid ${C.line}`,
                  background: sel ? C.ocre : "#fff",
                  color: sel ? C.ardoiseDark : C.inkSoft,
                  fontSize: 13,
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
        <div
          style={{
            display: "flex",
            gap: 7,
            flexWrap: "wrap",
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, "8+"].map((n) => {
            const sel = couverts === n || (n === "8+" && couverts >= 8);
            return (
              <button
                key={n}
                onClick={() =>
                  setCouverts(n === "8+" ? 8 : (n as number))
                }
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 9,
                  border: sel
                    ? `1.5px solid ${C.ocre}`
                    : `1px solid ${C.line}`,
                  background: sel ? C.ocre : "#fff",
                  color: sel ? C.ardoiseDark : C.inkSoft,
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
          placeholder="Laurent Dupont"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px",
            borderRadius: 10,
            border: nomErr
              ? `1.5px solid #E05A5A`
              : `1px solid ${C.line}`,
            background: "#fff",
            fontSize: 13.5,
            color: C.ink,
            fontFamily: SANS,
            outline: "none",
          }}
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
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px",
            borderRadius: 10,
            border: wappErr
              ? `1.5px solid #E05A5A`
              : `1px solid ${C.line}`,
            background: "#fff",
            fontSize: 13.5,
            color: C.ink,
            fontFamily: SANS,
            outline: "none",
          }}
        />
      </Field>

      {/* 6. Allergies */}
      <Field label="6 · Allergies ou restrictions alimentaires">
        <textarea
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="Sans gluten, allergie fruits de mer, végétarien… ou rien du tout"
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 14px",
            borderRadius: 10,
            border: `1px solid ${C.line}`,
            background: "#fff",
            fontSize: 13,
            color: C.ink,
            fontFamily: SANS,
            outline: "none",
            resize: "none",
            lineHeight: 1.45,
          }}
        />
      </Field>

      {/* 7. Occasion */}
      <Field label="7 · Occasion spéciale">
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {["Aucune", "Anniversaire", "Repas d'affaires", "Demande en mariage", "Autre"].map(
            (opt) => {
              const sel = occasion === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setOccasion(opt)}
                  style={{
                    padding: "9px 13px",
                    borderRadius: 22,
                    border: sel
                      ? `1.5px solid ${C.ocre}`
                      : `1px solid ${C.line}`,
                    background: sel ? C.ocre : "#fff",
                    color: sel ? C.ardoiseDark : C.inkSoft,
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
            setFormTouched(true);
            if (valid) setFormSent(true);
          }}
        >
          Confirmer ma réservation
        </PrimaryButton>
        {formTouched && !valid && (
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "#E05A5A",
              textAlign: "center",
            }}
          >
            Veuillez remplir les champs nom, WhatsApp et service.
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
          background: C.ardoise,
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
            background: C.ocre,
            opacity: 0.1,
          }}
        />
        <div
          style={{
            fontSize: 8.5,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: C.ocre,
            marginBottom: 6,
          }}
        >
          Votre réservation confirmée
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 22,
            color: C.cream,
            fontWeight: 600,
            lineHeight: 1.25,
          }}
        >
          Mardi 8 juillet · 19h30
        </div>
        <div style={{ fontSize: 13, color: "#A8B8C8", marginTop: 5 }}>
          Table pour 2 · Laurent
        </div>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 11, color: "#8AAABB" }}>📍</div>
          <div style={{ fontSize: 12, color: "#8AAABB" }}>
            Votre adresse ici
          </div>
        </div>
      </div>

      {/* Banners */}
      {tableAction === "retard" && (
        <Banner tone="ok">
          Retard signalé à l'équipe, merci.
        </Banner>
      )}
      {tableAction === "modifier" && (
        <Banner tone="neutral">
          Demande de modification transmise. Cyrille vous recontacte sous peu.
        </Banner>
      )}
      {tableAction === "annuler" && (
        <Banner tone="neutral">
          Annulation enregistrée. Merci de nous avoir prévenus, cela libère la table pour un autre convive.
        </Banner>
      )}

      {/* 3 Actions */}
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
            style={{ ...actionBtn(false), flex: 1 }}
          >
            ✎ Modifier
          </button>
          <button
            onClick={() => setTableAction("annuler")}
            style={{ ...actionBtn(false), flex: 1 }}
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
              color: C.inkSoft,
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

      {/* WhatsApp rappel */}
      <div
        style={{
          marginTop: 16,
          padding: "15px 16px",
          background: "#E8F5E9",
          borderRadius: 12,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          border: "1px solid #C8E6C9",
        }}
      >
        <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>💬</div>
        <div>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: "#2E7D32",
              marginBottom: 3,
            }}
          >
            Rappel WhatsApp
          </div>
          <div style={{ fontSize: 12, color: "#4A7C4E", lineHeight: 1.4 }}>
            Un rappel vous sera envoyé demain à 18h sur votre WhatsApp
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div
        style={{
          marginTop: 14,
          padding: "15px 16px",
          background: C.creamDeep,
          borderRadius: 12,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            background: C.ardoise,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: C.cream,
            flexShrink: 0,
          }}
        >
          ▦
        </div>
        <div>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: C.ink,
              marginBottom: 3,
            }}
          >
            QR Code table
          </div>
          <div style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.4 }}>
            À votre arrivée, ce QR code vous donnera accès à la carte du soir en temps réel
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
  favori,
  setFavori,
  newsletter,
  setNewsletter,
}: {
  go: (s: ScreenId) => void;
  favori: string | null;
  setFavori: (s: string) => void;
  newsletter: boolean;
  setNewsletter: (b: boolean) => void;
}) {
  const [avisClicked, setAvisClicked] = useState(false);

  return (
    <div style={{ padding: "22px 22px 28px" }}>
      {/* Titre desserts Céline */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 22,
            color: C.ink,
            fontWeight: 600,
          }}
        >
          Les desserts de Céline
        </div>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 14,
            color: C.inkSoft,
            margin: "8px 0 0",
            lineHeight: 1.5,
          }}
        >
          Chaque dessert est imaginé et réalisé par Céline Billa, notre chef pâtissière
        </p>
      </div>

      {/* Emplacement visuel desserts */}
      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",
          marginBottom: 16,
          position: "relative",
        }}
      >
        <ImagePlaceholder
          label="Nos desserts"
          style={{
            width: "100%",
            height: 140,
            background: `linear-gradient(135deg, ${C.terracottaDeep}, ${C.ocre})`,
          }}
        />
      </div>

      {/* 3 cartes desserts */}
      <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
        {[
          { nom: "Tarte fine abricots", desc: "crème d'amande", emoji: "🍑" },
          { nom: "Moelleux chocolat", desc: "glace vanille maison", emoji: "🍫" },
          { nom: "Panna cotta lavande", desc: "coulis de fraise", emoji: "🍓" },
        ].map((d) => (
          <div
            key={d.nom}
            style={{
              background: "#fff",
              borderRadius: 11,
              padding: "13px 15px",
              border: `1px solid ${C.line}`,
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>
              {d.emoji}
            </div>
            <div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 14.5,
                  color: C.ink,
                  fontWeight: 600,
                }}
              >
                {d.nom}
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 12,
                  color: C.inkSoft,
                  marginTop: 2,
                }}
              >
                {d.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coup de cœur */}
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.terracotta,
            marginBottom: 10,
            fontWeight: 700,
          }}
        >
          Votre coup de cœur ce soir ?
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Entrée", "Poisson ou Viande", "Dessert Céline", "Le pain maison"].map(
            (label) => {
              const sel = favori === label;
              return (
                <button
                  key={label}
                  onClick={() => setFavori(label)}
                  style={{
                    padding: "9px 13px",
                    borderRadius: 22,
                    border: sel
                      ? `1.5px solid ${C.terracotta}`
                      : `1px solid ${C.line}`,
                    background: sel ? C.terracotta : "#fff",
                    color: sel ? C.cream : C.inkSoft,
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
            }
          )}
        </div>
      </div>

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
        <div
          style={{
            fontSize: 12.5,
            color: C.inkSoft,
            marginBottom: 10,
            lineHeight: 1.4,
          }}
        >
          Votre avis aide Cyrille à se faire connaître
        </div>
        <button
          onClick={() => setAvisClicked(true)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: avisClicked ? C.green : C.ardoise,
            color: C.cream,
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
          background: C.ardoise,
          borderRadius: 14,
          color: C.cream,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: C.ocre,
            marginBottom: 4,
          }}
        >
          ✦ Newsletter
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          La Carte du Moment
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#A8B8C8",
            lineHeight: 1.5,
            margin: "0 0 14px",
          }}
        >
          Chaque lundi, Cyrille partage les nouveautés de la semaine — avant tout le monde.
        </p>
        <button
          onClick={() => setNewsletter(!newsletter)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: newsletter ? C.ocre : C.terracotta,
            color: newsletter ? C.ardoiseDark : C.cream,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.02em",
            transition: "all 0.25s",
            fontFamily: SANS,
          }}
        >
          {newsletter
            ? "✓ Vous êtes inscrit"
            : "Recevoir la carte du lundi"}
        </button>
      </div>

      {/* CTA final */}
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
        <div style={{ fontSize: 10.5, color: C.inkSoft, lineHeight: 1.5 }}>
          Démonstration personnalisable · ByCo Systems · bycosystems.xyz
        </div>
        <div
          style={{
            fontSize: 9.5,
            color: "#AAA09A",
            marginTop: 4,
            fontStyle: "italic",
          }}
        >
          Vos photos et votre logo seront intégrés lors du déploiement final
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
        background: disabled ? C.creamDeep : C.ocre,
        color: disabled ? C.inkSoft : C.ardoiseDark,
        fontSize: 13.5,
        fontWeight: 700,
        letterSpacing: "0.02em",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: SANS,
        transition: "all 0.2s",
        boxShadow: disabled ? "none" : `0 4px 16px rgba(212,168,83,0.35)`,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "13px 18px",
        borderRadius: 11,
        border: `1.5px solid ${C.ardoise}`,
        background: "transparent",
        color: C.ardoise,
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
          color: C.ardoise,
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
            color: C.inkSoft,
            marginBottom: 8,
            fontStyle: "italic",
          }}
        >
          {sublabel}
        </div>
      )}
      {children}
      {error && (
        <div
          style={{
            fontSize: 11,
            color: "#E05A5A",
            marginTop: 5,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

function Banner({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "ok" | "neutral";
}) {
  const bg = tone === "ok" ? C.greenBg : C.creamDeep;
  const bd = tone === "ok" ? C.green : C.ocre;
  return (
    <div
      style={{
        marginTop: 14,
        padding: "12px 15px",
        background: bg,
        borderLeft: `3px solid ${bd}`,
        borderRadius: 10,
        fontSize: 12.5,
        color: C.ink,
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
    border: active ? `1.5px solid ${C.ocre}` : `1px solid ${C.line}`,
    background: active ? C.creamDeep : "#fff",
    color: active ? C.ardoise : C.inkSoft,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: SANS,
    transition: "all 0.2s",
    textAlign: "center" as const,
  };
}

/* ── Emplacement visuel (texte, sans image) ─────────────────── */

function ImagePlaceholder({
  label,
  style,
}: {
  label: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 12,
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 13,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.03em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function LogoPlaceholder({
  style,
  text,
}: {
  style: React.CSSProperties;
  text: string;
}) {
  return <div style={style}>{text}</div>;
}
