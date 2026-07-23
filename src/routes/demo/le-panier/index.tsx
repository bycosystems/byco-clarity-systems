// ─────────────────────────────────────────────────────────────
// src/routes/demo/le-panier/index.tsx
// "Le Carnet du Voyageur" — démo mini-application pour Le Panier (Vieux Nice)
// Conçue par ByCo Systems. Démonstration personnalisable.
//
// DÉPLOIEMENT :
//   1. Placer ce fichier dans  src/routes/demo/le-panier/index.tsx
//   2. Placer le PDF comparatif dans  public/demo/le-panier/comparatif.pdf
//   3. git add . && git commit && git push  → Cloudflare Pages déploie
//   4. URL publique : https://bycosystems.xyz/demo/le-panier
//
// Pure front-end, aucune dépendance backend. TanStack Start + React + TS.
// (Tailwind disponible dans le repo ; ici les styles sont inline pour
//  garantir un rendu identique à la démo validée, sans dépendre de la
//  config Tailwind du projet. Migrables en classes Tailwind si souhaité.)
// ─────────────────────────────────────────────────────────────

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/demo/le-panier/")({
  component: CarnetDuVoyageur,
  head: () => ({
    meta: [
      { title: "Le Carnet du Voyageur · Le Panier × ByCo Systems" },
      {
        name: "description",
        content:
          "Démonstration interactive de la mini-application sur-mesure conçue par ByCo Systems pour Le Panier, Vieux Nice.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Le Carnet du Voyageur · Le Panier × ByCo Systems" },
      {
        property: "og:description",
        content:
          "Démonstration interactive de la mini-application sur-mesure conçue par ByCo Systems pour Le Panier, Vieux Nice.",
      },
      { property: "og:image", content: "https://bycosystems.xyz/demo/le-panier/og-image.jpg" },
      { name: "twitter:title", content: "Le Carnet du Voyageur · Le Panier × ByCo Systems" },
      {
        name: "twitter:description",
        content:
          "Démonstration interactive de la mini-application sur-mesure conçue par ByCo Systems pour Le Panier, Vieux Nice.",
      },
      { name: "twitter:image", content: "https://bycosystems.xyz/demo/le-panier/og-image.jpg" },
    ],
  }),
});

const C = {
  terracotta: "#B8543A",
  terracottaDeep: "#933F2B",
  cream: "#F5EEE3",
  creamDeep: "#EBE0CE",
  ink: "#26211C",
  inkSoft: "#5C534A",
  gold: "#C2924A",
  line: "#D8C9B2",
};

const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Inter", "Helvetica Neue", system-ui, sans-serif';

/* ── Date dynamique ──────────────────────────────────────── */

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

type ScreenId =
  | "accueil"
  | "voyages"
  | "prevoyage"
  | "monvoyage"
  | "carnet";

function CarnetDuVoyageur() {
  const [screen, setScreen] = useState<ScreenId>("accueil");

  const [allergies, setAllergies] = useState("");
  const [regime, setRegime] = useState("");
  const [occasion, setOccasion] = useState("");
  const [boisson, setBoisson] = useState("");
  const [aventure, setAventure] = useState("");
  const [sent, setSent] = useState(false);

  const [confirmed, setConfirmed] = useState<
    null | "yes" | "modify" | "cancel"
  >(null);
  const [escale, setEscale] = useState(2);

  const [favEscale, setFavEscale] = useState<number | null>(null);
  const [newsletter, setNewsletter] = useState(false);

  const go = (s: ScreenId) => {
    setScreen(s);
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  return (
    <div
      style={{
        fontFamily: SANS,
        background: C.ink,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "16px 0",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap"
      />
      <div
        style={{
          width: 390,
          maxWidth: "100%",
          background: C.cream,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          position: "relative",
          minHeight: 780,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopBar screen={screen} />
        <div style={{ flex: 1, position: "relative" }}>
          {screen === "accueil" && <Accueil go={go} />}
          {screen === "voyages" && <Voyages go={go} />}
          {screen === "prevoyage" && (
            <PreVoyage
              go={go}
              state={{ allergies, regime, occasion, boisson, aventure, sent }}
              set={{
                setAllergies,
                setRegime,
                setOccasion,
                setBoisson,
                setAventure,
                setSent,
              }}
            />
          )}
          {screen === "monvoyage" && (
            <MonVoyage
              go={go}
              confirmed={confirmed}
              setConfirmed={setConfirmed}
              escale={escale}
              setEscale={setEscale}
            />
          )}
          {screen === "carnet" && (
            <Carnet
              go={go}
              favEscale={favEscale}
              setFavEscale={setFavEscale}
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

/* ── Chrome ──────────────────────────────────────────────── */

function TopBar({ screen }: { screen: ScreenId }) {
  const titles: Record<ScreenId, string> = {
    accueil: "",
    voyages: "Les 3 Voyages",
    prevoyage: "Préparer mon voyage",
    monvoyage: "Mon voyage",
    carnet: "Carnet de bord",
  };
  return (
    <div
      style={{
        background: C.cream,
        padding: "18px 22px 10px",
        textAlign: "center",
        borderBottom: screen === "accueil" ? "none" : `1px solid ${C.line}`,
      }}
    >
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 19,
          letterSpacing: "0.32em",
          color: C.ink,
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        Le Panier
      </div>
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.42em",
          color: C.terracotta,
          textTransform: "uppercase",
          marginTop: 3,
        }}
      >
        Vieux Nice
      </div>
      {titles[screen] ? (
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 15,
            fontStyle: "italic",
            color: C.inkSoft,
            marginTop: 10,
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
    { id: "voyages", label: "Voyages", icon: "❖" },
    { id: "prevoyage", label: "Préparer", icon: "✎" },
    { id: "monvoyage", label: "Mon voyage", icon: "➤" },
    { id: "carnet", label: "Carnet", icon: "✦" },
  ];
  return (
    <div
      style={{
        display: "flex",
        background: C.ink,
        borderTop: `2px solid ${C.terracotta}`,
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
              background: active ? C.terracotta : "transparent",
              color: active ? C.cream : "#A99B88",
              padding: "10px 2px 9px",
              cursor: "pointer",
              transition: "all 0.25s",
            }}
          >
            <div style={{ fontSize: 14, lineHeight: 1 }}>{it.icon}</div>
            <div
              style={{
                fontSize: 8.5,
                letterSpacing: "0.06em",
                marginTop: 4,
                textTransform: "uppercase",
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
        background: "rgba(38,33,28,0.82)",
        color: C.cream,
        fontSize: 7.5,
        letterSpacing: "0.12em",
        padding: "3px 7px",
        borderRadius: 20,
        textTransform: "uppercase",
      }}
    >
      Démo ByCo
    </div>
  );
}

/* ── Écran 1 ─────────────────────────────────────────────── */

function Accueil({ go }: { go: (s: ScreenId) => void }) {
  return (
    <div style={{ padding: "0 0 24px" }}>
      <div
        style={{
          background: `linear-gradient(160deg, ${C.terracotta} 0%, ${C.terracottaDeep} 100%)`,
          padding: "44px 26px 50px",
          color: C.cream,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.12,
            background:
              "radial-gradient(circle at 80% 20%, #fff 0%, transparent 45%)",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            Carnet du Voyageur
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 33,
              lineHeight: 1.12,
              marginTop: 16,
              fontWeight: 600,
            }}
          >
            Bienvenue à bord
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 17,
              fontStyle: "italic",
              marginTop: 10,
              opacity: 0.92,
              lineHeight: 1.4,
            }}
          >
            votre voyage gustatif commence ici.
          </div>
        </div>
      </div>

      <div style={{ padding: "26px 26px 8px" }}>
        <p
          style={{
            fontFamily: SERIF,
            fontSize: 17,
            lineHeight: 1.55,
            color: C.ink,
            margin: 0,
          }}
        >
          Chez Le Panier, on ne commande pas un plat. On embarque pour une
          traversée imaginée chaque jour par Aurélien et Marie, au gré des
          saisons et du marché.
        </p>
      </div>

      <div style={{ padding: "18px 26px 0", display: "grid", gap: 12 }}>
        <PrimaryButton onClick={() => go("prevoyage")}>
          Préparer mon voyage
        </PrimaryButton>
        <GhostButton onClick={() => go("voyages")}>
          Découvrir les 3 voyages
        </GhostButton>
      </div>

      <div
        style={{
          margin: "26px 26px 0",
          padding: "16px 18px",
          background: C.creamDeep,
          borderRadius: 14,
          borderLeft: `3px solid ${C.gold}`,
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.terracottaDeep,
            marginBottom: 6,
          }}
        >
          Votre réservation
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 18, color: C.ink }}>
          {prochainVendredi()} · 19h30
        </div>
        <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3 }}>
          Table pour 2 · au nom d'Aurélie
        </div>
      </div>
    </div>
  );
}

/* ── Écran 2 ─────────────────────────────────────────────── */

function Voyages({ go }: { go: (s: ScreenId) => void }) {
  const formules = [
    {
      nom: "On The Road",
      moment: "Midi · 4 escales",
      detail: "1 entrée · 2 plats · 1 dessert",
      prix: "47",
      star: false,
    },
    {
      nom: "Voyage",
      moment: "Soir · 5 escales",
      detail: "2 entrées · 2 plats · 1 dessert",
      prix: "69",
      star: true,
    },
    {
      nom: "Immersion",
      moment: "Soir · 7 escales",
      detail: "2 entrées · 2 plats · fromage · 2 desserts",
      prix: "79",
      star: false,
    },
  ];
  return (
    <div style={{ padding: "22px 22px 26px" }}>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 15.5,
          color: C.inkSoft,
          lineHeight: 1.5,
          marginTop: 0,
          marginBottom: 22,
          textAlign: "center",
        }}
      >
        Le contenu de chaque escale reste la signature du Chef.
        <br />
        Vous le découvrirez à table, plat après plat.
      </p>

      <div style={{ display: "grid", gap: 14 }}>
        {formules.map((f) => (
          <div
            key={f.nom}
            style={{
              background: f.star ? C.terracotta : "#fff",
              color: f.star ? C.cream : C.ink,
              borderRadius: 16,
              padding: "18px 20px",
              border: f.star ? "none" : `1px solid ${C.line}`,
              position: "relative",
              boxShadow: f.star
                ? "0 12px 30px rgba(184,84,58,0.32)"
                : "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            {f.star && (
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 16,
                  fontSize: 8,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  background: C.cream,
                  color: C.terracottaDeep,
                  padding: "3px 8px",
                  borderRadius: 20,
                  fontWeight: 700,
                }}
              >
                Le plus choisi
              </div>
            )}
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                opacity: 0.8,
              }}
            >
              {f.moment}
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 25,
                fontWeight: 600,
                marginTop: 5,
              }}
            >
              {f.nom}
            </div>
            <div
              style={{
                fontSize: 12.5,
                marginTop: 6,
                opacity: 0.86,
                lineHeight: 1.4,
              }}
            >
              {f.detail}
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 28,
                fontWeight: 600,
                marginTop: 12,
              }}
            >
              {f.prix}
              <span style={{ fontSize: 15, marginLeft: 2 }}>€</span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: SANS,
                  opacity: 0.7,
                  marginLeft: 6,
                }}
              >
                hors boissons
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 22,
          background: C.ink,
          borderRadius: 16,
          padding: "20px 20px 22px",
          color: C.cream,
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: C.gold,
          }}
        >
          La signature de Marie
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 21,
            marginTop: 6,
            fontWeight: 600,
          }}
        >
          Accords mets & vins
        </div>
        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {[
            ["Accord vins", "Producteurs biodynamiques, petites cuvées"],
            ["Cocktails maison", "Imaginés pour prolonger chaque escale"],
            ["Sans alcool", "Une option soignée, jamais une arrière-pensée"],
          ].map(([t, d]) => (
            <div
              key={t}
              style={{ display: "flex", gap: 10, alignItems: "baseline" }}
            >
              <span style={{ color: C.gold, fontSize: 13 }}>—</span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t}</div>
                <div
                  style={{ fontSize: 11.5, color: "#B7AC9C", marginTop: 1 }}
                >
                  {d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <PrimaryButton onClick={() => go("prevoyage")}>
          Préparer mon voyage
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ── Écran 3 ─────────────────────────────────────────────── */

function PreVoyage({
  go,
  state,
  set,
}: {
  go: (s: ScreenId) => void;
  state: {
    allergies: string;
    regime: string;
    occasion: string;
    boisson: string;
    aventure: string;
    sent: boolean;
  };
  set: {
    setAllergies: (v: string) => void;
    setRegime: (v: string) => void;
    setOccasion: (v: string) => void;
    setBoisson: (v: string) => void;
    setAventure: (v: string) => void;
    setSent: (v: boolean) => void;
  };
}) {
  const { allergies, regime, occasion, boisson, aventure, sent } = state;
  const {
    setAllergies,
    setRegime,
    setOccasion,
    setBoisson,
    setAventure,
    setSent,
  } = set;

  if (sent) {
    return (
      <div
        style={{
          padding: "44px 28px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: C.terracotta,
            color: C.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            marginBottom: 22,
          }}
        >
          ✦
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 24,
            color: C.ink,
            lineHeight: 1.3,
          }}
        >
          Vos préférences sont
          <br /> entre de bonnes mains
        </div>
        <p
          style={{
            fontSize: 13.5,
            color: C.inkSoft,
            lineHeight: 1.55,
            marginTop: 14,
            maxWidth: 290,
          }}
        >
          Aurélien et Marie les découvriront avant votre arrivée et composeront
          votre voyage en conséquence. À très vite au Panier.
        </p>
        <div style={{ marginTop: 26, width: "100%" }}>
          <PrimaryButton onClick={() => go("monvoyage")}>
            Voir mon voyage
          </PrimaryButton>
        </div>
        <button
          onClick={() => setSent(false)}
          style={{
            marginTop: 12,
            background: "none",
            border: "none",
            color: C.inkSoft,
            fontSize: 12,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Modifier mes réponses
        </button>
      </div>
    );
  }

  const ready = occasion && boisson && aventure;

  return (
    <div style={{ padding: "20px 22px 28px" }}>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 15,
          color: C.inkSoft,
          marginTop: 0,
          marginBottom: 20,
          lineHeight: 1.5,
        }}
      >
        Marie & Aurélien préparent votre voyage. Cinq précisions suffisent —
        moins d'une minute.
      </p>

      <Field label="1 · Allergies ou intolérances">
        <TextInput
          value={allergies}
          onChange={setAllergies}
          placeholder="Fruits à coque, crustacés… ou rien"
        />
      </Field>
      <Field label="2 · Régime particulier">
        <Chips
          value={regime}
          onChange={setRegime}
          options={["Aucun", "Végétarien", "Sans porc", "Sans gluten"]}
        />
      </Field>
      <Field label="3 · Une occasion à célébrer ?">
        <Chips
          value={occasion}
          onChange={setOccasion}
          options={[
            "Simple plaisir",
            "Anniversaire",
            "Demande spéciale",
            "Première visite",
            "Habitué",
          ]}
        />
      </Field>
      <Field label="4 · Côté boisson">
        <Chips
          value={boisson}
          onChange={setBoisson}
          options={["Accord mets-vins", "Cocktail maison", "Sans alcool"]}
        />
      </Field>
      <Field label="5 · Votre niveau d'aventure">
        <Chips
          value={aventure}
          onChange={setAventure}
          options={["Surprenez-moi totalement", "Évitez ce que j'ai indiqué"]}
          column
        />
      </Field>

      <div style={{ marginTop: 8 }}>
        <PrimaryButton disabled={!ready} onClick={() => setSent(true)}>
          {ready
            ? "Envoyer mes préférences à Aurélien"
            : "Complétez les questions 3, 4 et 5"}
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ── Écran 4 ─────────────────────────────────────────────── */

function MonVoyage({
  go,
  confirmed,
  setConfirmed,
  escale,
  setEscale,
}: {
  go: (s: ScreenId) => void;
  confirmed: null | "yes" | "modify" | "cancel";
  setConfirmed: (v: null | "yes" | "modify" | "cancel") => void;
  escale: number;
  setEscale: (n: number) => void;
}) {
  return (
    <div style={{ padding: "22px 22px 28px" }}>
      <div
        style={{
          background: "#fff",
          border: `1px solid ${C.line}`,
          borderRadius: 16,
          padding: "20px 20px 22px",
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: C.terracottaDeep,
          }}
        >
          Demain · 19h30
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 21,
            color: C.ink,
            marginTop: 7,
            lineHeight: 1.3,
          }}
        >
          Votre voyage commence demain
        </div>
        <p style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 6 }}>
          Un mot suffit pour confirmer votre table à Aurélien et Marie.
        </p>

        {confirmed === null && (
          <div style={{ display: "grid", gap: 9, marginTop: 16 }}>
            <PrimaryButton onClick={() => setConfirmed("yes")}>
              Je confirme ma présence
            </PrimaryButton>
            <div style={{ display: "flex", gap: 9 }}>
              <SmallGhost onClick={() => setConfirmed("modify")}>
                Modifier
              </SmallGhost>
              <SmallGhost onClick={() => setConfirmed("cancel")}>
                Annuler
              </SmallGhost>
            </div>
          </div>
        )}

        {confirmed === "yes" && (
          <Banner tone="ok">
            Table confirmée. Aurélien vous attend demain à 19h30.
          </Banner>
        )}
        {confirmed === "modify" && (
          <Banner tone="neutral">
            Demande de modification transmise. Le restaurant vous recontacte
            sous peu.
          </Banner>
        )}
        {confirmed === "cancel" && (
          <Banner tone="neutral">
            Annulation enregistrée — la table est libérée pour un autre
            voyageur. Merci de l'avoir signalé.
          </Banner>
        )}
        {confirmed !== null && (
          <button
            onClick={() => setConfirmed(null)}
            style={{
              marginTop: 12,
              background: "none",
              border: "none",
              color: C.inkSoft,
              fontSize: 11.5,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Revenir
          </button>
        )}
      </div>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 13,
          alignItems: "center",
          padding: "14px 16px",
          background: C.creamDeep,
          borderRadius: 14,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 8,
            background: C.ink,
            color: C.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          ▦
        </div>
        <div style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.45 }}>
          À table, un QR code vous ouvrira votre{" "}
          <strong style={{ color: C.ink }}>voyage en temps réel</strong>,
          escale après escale.
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          background: `linear-gradient(160deg, ${C.terracotta}, ${C.terracottaDeep})`,
          borderRadius: 16,
          padding: "20px 20px 22px",
          color: C.cream,
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          Aperçu · voyage en cours
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 19,
            marginTop: 6,
            marginBottom: 16,
          }}
        >
          Escale {escale} sur 5
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((n) => {
            const done = n < escale;
            const current = n === escale;
            return (
              <div
                key={n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  opacity: n > escale ? 0.5 : 1,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `1.5px solid ${C.cream}`,
                    background: done ? C.cream : "transparent",
                    color: done ? C.terracotta : C.cream,
                    fontSize: 11,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {done ? "✓" : n}
                </div>
                <div style={{ fontSize: 13 }}>
                  {done && "Escale servie"}
                  {current && (
                    <strong>En cours de dressage en cuisine…</strong>
                  )}
                  {n > escale && "À venir — surprise du Chef"}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 9, marginTop: 18 }}>
          <button
            onClick={() => setEscale(Math.max(1, escale - 1))}
            style={miniBtn(false)}
          >
            ‹ Précédente
          </button>
          <button
            onClick={() => setEscale(Math.min(5, escale + 1))}
            style={miniBtn(true)}
          >
            Escale suivante ›
          </button>
        </div>
        <div
          style={{
            fontSize: 10,
            opacity: 0.72,
            marginTop: 12,
            fontStyle: "italic",
            fontFamily: SERIF,
          }}
        >
          Le nom des plats reste tu — la surprise est le cœur du voyage.
        </div>
      </div>

      {escale >= 5 && (
        <div style={{ marginTop: 16 }}>
          <PrimaryButton onClick={() => go("carnet")}>
            Clore mon carnet de bord
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}

/* ── Écran 5 ─────────────────────────────────────────────── */

function Carnet({
  go,
  favEscale,
  setFavEscale,
  newsletter,
  setNewsletter,
}: {
  go: (s: ScreenId) => void;
  favEscale: number | null;
  setFavEscale: (n: number) => void;
  newsletter: boolean;
  setNewsletter: (b: boolean) => void;
}) {
  return (
    <div style={{ padding: "22px 22px 28px" }}>
      <p
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 15.5,
          color: C.inkSoft,
          marginTop: 0,
          marginBottom: 18,
          lineHeight: 1.5,
        }}
      >
        Le voyage s'achève. Aurélien et Marie aimeraient connaître votre escale
        préférée.
      </p>

      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: C.terracottaDeep,
          marginBottom: 10,
        }}
      >
        Votre escale préférée
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 7,
        }}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const sel = favEscale === n;
          return (
            <button
              key={n}
              onClick={() => setFavEscale(n)}
              style={{
                aspectRatio: "1",
                borderRadius: 12,
                border: sel
                  ? `2px solid ${C.terracotta}`
                  : `1px solid ${C.line}`,
                background: sel ? C.terracotta : "#fff",
                color: sel ? C.cream : C.ink,
                fontFamily: SERIF,
                fontSize: 19,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {n}
            </button>
          );
        })}
      </div>

      {favEscale && (
        <div
          style={{
            marginTop: 18,
            padding: "16px 18px",
            background: "#fff",
            borderRadius: 14,
            border: `1px solid ${C.line}`,
          }}
        >
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 16,
              color: C.ink,
              marginBottom: 12,
            }}
          >
            Partagez votre voyage
          </div>
          <PrimaryButton onClick={() => {}}>
            Laisser un avis Google ★
          </PrimaryButton>
        </div>
      )}

      <div
        style={{
          marginTop: 16,
          padding: "18px 18px",
          background: C.ink,
          borderRadius: 14,
          color: C.cream,
        }}
      >
        <div style={{ fontFamily: SERIF, fontSize: 17, marginBottom: 5 }}>
          Le Voyage du Mois
        </div>
        <p
          style={{
            fontSize: 12,
            color: "#B7AC9C",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Chaque mois, quand la carte change, recevez le teaser du nouveau
          voyage — quelques images, un mot du Chef.
        </p>
        <button
          onClick={() => setNewsletter(!newsletter)}
          style={{
            marginTop: 14,
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: newsletter ? C.gold : C.terracotta,
            color: newsletter ? C.ink : C.cream,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.02em",
            transition: "all 0.25s",
          }}
        >
          {newsletter ? "✓ Vous êtes embarqué" : "Recevoir le Voyage du Mois"}
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <GhostButton onClick={() => go("prevoyage")}>
          Préparer mon prochain voyage
        </GhostButton>
      </div>
    </div>
  );
}

/* ── UI primitives ───────────────────────────────────────── */

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
        background: disabled ? C.creamDeep : C.terracotta,
        color: disabled ? C.inkSoft : C.cream,
        fontSize: 13.5,
        fontWeight: 600,
        letterSpacing: "0.02em",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: SANS,
        transition: "all 0.2s",
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
        border: `1.5px solid ${C.terracotta}`,
        background: "transparent",
        color: C.terracottaDeep,
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

function SmallGhost({
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
        flex: 1,
        padding: "11px",
        borderRadius: 10,
        border: `1px solid ${C.line}`,
        background: "#fff",
        color: C.inkSoft,
        fontSize: 12.5,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: SANS,
      }}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: C.terracottaDeep,
          fontWeight: 700,
          marginBottom: 9,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
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
  );
}

function Chips({
  value,
  onChange,
  options,
  column,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  column?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        flexDirection: column ? "column" : "row",
      }}
    >
      {options.map((opt) => {
        const sel = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: "10px 14px",
              borderRadius: 22,
              border: sel
                ? `1.5px solid ${C.terracotta}`
                : `1px solid ${C.line}`,
              background: sel ? C.terracotta : "#fff",
              color: sel ? C.cream : C.inkSoft,
              fontSize: 12.5,
              fontWeight: sel ? 600 : 500,
              cursor: "pointer",
              fontFamily: SANS,
              transition: "all 0.18s",
              textAlign: column ? "left" : "center",
            }}
          >
            {opt}
          </button>
        );
      })}
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
  const bg = tone === "ok" ? "#E8F0E4" : C.creamDeep;
  const bd = tone === "ok" ? "#7BA05B" : C.gold;
  return (
    <div
      style={{
        marginTop: 16,
        padding: "13px 15px",
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

function miniBtn(filled: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: "10px",
    borderRadius: 9,
    border: `1px solid ${C.cream}`,
    background: filled ? C.cream : "transparent",
    color: filled ? C.terracotta : C.cream,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: SANS,
  };
}
