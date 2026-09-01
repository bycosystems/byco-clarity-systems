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
// Paramètre d'URL optionnel `?lang=en` pour la version anglaise de la
// page (prospection Royaume-Uni). Absent, ou toute valeur autre que
// "en" → contenu français inchangé. Se combine avec `?secteur=`, dans
// n'importe quel ordre. Un seul dictionnaire FR/EN dans ce fichier,
// pas de route dupliquée.
//
// Aucun élément nominatif : pas de nom d'entreprise, pas d'adresse,
// pas de photo personnelle, pas de citation d'avis Google spécifique.
//
// Pure front-end, aucune dépendance backend. TanStack Start + React + TS.
// Styles inline pour garantir un rendu identique aux autres démos.
// ─────────────────────────────────────────────────────────────

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMarche } from "@/lib/market";
import { priceFor, type Marche } from "@/lib/pricing";
import { useOrlaneCall } from "@/lib/useOrlaneCall";

export const Route = createFileRoute("/demo/decouvrir/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { secteur?: string; lang?: string; prospect?: string } => ({
    secteur: typeof search.secteur === "string" ? search.secteur : undefined,
    lang: typeof search.lang === "string" ? search.lang : undefined,
    prospect: typeof search.prospect === "string" ? search.prospect : undefined,
  }),
  component: DecouvrirDemo,
  head: ({ match }) => {
    const search = match.search as { lang?: string; secteur?: string };
    const lang = resolveLang(search.lang);
    const secteur = resolveSecteur(search.secteur);
    const m = META[secteur][lang];
    const ogImage = "https://bycosystems.xyz/demo/decouvrir/og-image.png";
    return {
      meta: [
        { title: m.title },
        { name: "description", content: m.description },
        { name: "robots", content: "noindex" },
        { property: "og:title", content: m.title },
        { property: "og:description", content: m.ogDescription },
        { property: "og:image", content: ogImage },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: m.title },
        { name: "twitter:description", content: m.ogDescription },
        { name: "twitter:image", content: ogImage },
      ],
    };
  },
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

const WHATSAPP_URL = "https://wa.me/447576594092";

/* ── Langue ─────────────────────────────────────────────────────
   `?lang=en` bascule la page en anglais. Absent, ou toute autre
   valeur → français (comportement par défaut inchangé).
   ─────────────────────────────────────────────────────────────── */

type Lang = "fr" | "en";

function resolveLang(raw: string | undefined): Lang {
  return raw === "en" ? "en" : "fr";
}

/* ── Nom de prospect (Hero) ────────────────────────────────────
   `?prospect=` insère le nom de la structure démarchée dans le Hero,
   sans édition manuelle ni redéploiement par prospect. Absent, vide,
   ou uniquement des espaces → formulation neutre par défaut,
   inchangée (jamais de undefined / placeholder brut affiché).
   ─────────────────────────────────────────────────────────────── */

const PROSPECT_NAME_MAX_LENGTH = 60;

function resolveProspect(raw: string | undefined): string | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return undefined;
  return trimmed.length > PROSPECT_NAME_MAX_LENGTH
    ? `${trimmed.slice(0, PROSPECT_NAME_MAX_LENGTH - 1).trimEnd()}…`
    : trimmed;
}

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

const COPY: Record<Secteur, Record<Lang, Copy>> = {
  sante: {
    fr: {
      eyebrowHero: "▪ Toujours disponible pour vos patients",
      headline: "Pendant votre consultation, qui répond au téléphone ?",
      accrocheHeadline: "Vous, en consultation : qui décroche ?",
      accrocheP1:
        "Beaucoup de cabinets tiennent grâce à un seul praticien, toujours le même, toujours disponible pour ses patients. C'est une force, et une vraie promesse de qualité.",
      accrocheP2:
        "Le revers, lui, n'est jamais dit à voix haute : quand vous êtes en consultation, personne d'autre n'est là pour décrocher, ni pour une question de tarif, ni pour une urgence.",
      chips: [
        { label: "Consultation", value: "Sur demande" },
        { label: "Urgence", value: "Prioritaire", accent: true },
        { label: "Rendez-vous", value: "7j/7" },
        { label: "Zone", value: "Votre secteur" },
      ],
      demoIntro:
        "C'est vous qui appelez ci-dessous : un vrai appel vers Orlane, l'agent vocal de démonstration ByCo. Une fois configuré et personnalisé pour votre cabinet, votre agent saura restituer ce type d'information, comme dans l'exemple ci-dessous.",
      whatsappBody:
        "Dès que vous raccrochez, un récapitulatif part directement sur WhatsApp : le motif de l'appel, le numéro du patient, et ce qu'il attend de vous. Rien ne se perd, même au bloc.",
      recapTitle: "📞 Nouvel appel reçu",
      recapBody:
        "Un patient a appelé pour une question de tarif consultation.\nNuméro : +33 6 XX XX XX XX\nSouhaite être rappelé si besoin.",
    },
    en: {
      eyebrowHero: "▪ Always available for your patients",
      headline: "While you're with a patient, who answers the phone?",
      accrocheHeadline: "You, in consultation: who picks up?",
      accrocheP1:
        "Many practices run on a single practitioner, always the same one, always available for their patients. That's a strength, and a real promise of quality.",
      accrocheP2:
        "The downside is never said out loud: when you're with a patient, no one else is there to pick up, not for a pricing question, not for an emergency.",
      chips: [
        { label: "Consultation", value: "On request" },
        { label: "Emergency", value: "Priority", accent: true },
        { label: "Appointments", value: "7 days a week" },
        { label: "Area", value: "Your region" },
      ],
      demoIntro:
        "You're the one calling below: a real call to Orlane, ByCo's demo voice agent. Once configured and customized for your practice, your agent will handle this kind of information, as shown in the example below.",
      whatsappBody:
        "As soon as you hang up, a summary is sent straight to WhatsApp: the reason for the call, the patient's number, and what they need from you. Nothing gets lost, even mid-appointment.",
      recapTitle: "📞 New call received",
      recapBody:
        "A patient called about a consultation pricing question.\nNumber: +33 6 XX XX XX XX\nWould like a callback if needed.",
    },
  },
  urgence: {
    fr: {
      eyebrowHero: "▪ Toujours disponible pour vos clients",
      headline: "Pendant votre intervention, qui répond au téléphone ?",
      accrocheHeadline: "Vous, sur place : qui décroche ?",
      accrocheP1:
        "Beaucoup d'artisans tiennent grâce à une seule personne, toujours la même, toujours disponible pour dépanner. C'est une force, et une vraie promesse de réactivité.",
      accrocheP2:
        "Le revers, lui, n'est jamais dit à voix haute : quand vous êtes sur une intervention, personne d'autre n'est là pour décrocher, ni pour une urgence, ni pour un simple devis.",
      chips: [
        { label: "Dépannage", value: "Sur demande" },
        { label: "Urgence", value: "Prioritaire", accent: true },
        { label: "Intervention", value: "7j/7" },
        { label: "Zone", value: "Votre secteur" },
      ],
      demoIntro:
        "C'est vous qui appelez ci-dessous : un vrai appel vers Orlane, l'agent vocal de démonstration ByCo. Une fois configuré et personnalisé pour votre activité, votre agent saura restituer ce type d'information, comme dans l'exemple ci-dessous.",
      whatsappBody:
        "Dès que vous raccrochez, un récapitulatif part directement sur WhatsApp : le motif de l'appel, le numéro du client, et ce qu'il attend de vous. Rien ne se perd, même en pleine intervention.",
      recapTitle: "📞 Nouvel appel reçu",
      recapBody:
        "Un client a appelé pour une demande d'intervention urgente.\nNuméro : +33 6 XX XX XX XX\nSouhaite être rappelé si besoin.",
    },
    en: {
      eyebrowHero: "▪ Always available for your clients",
      headline: "While you're on a job, who answers the phone?",
      accrocheHeadline: "You, on site: who picks up?",
      accrocheP1:
        "Many tradespeople run on a single person, always the same one, always available to help. That's a strength, and a real promise of responsiveness.",
      accrocheP2:
        "The downside is never said out loud: when you're on a job, no one else is there to pick up, not for an emergency, not for a simple quote.",
      chips: [
        { label: "Callout", value: "On request" },
        { label: "Emergency", value: "Priority", accent: true },
        { label: "Job", value: "7 days a week" },
        { label: "Area", value: "Your region" },
      ],
      demoIntro:
        "You're the one calling below: a real call to Orlane, ByCo's demo voice agent. Once configured and customized for your business, your agent will handle this kind of information, as shown in the example below.",
      whatsappBody:
        "As soon as you hang up, a summary is sent straight to WhatsApp: the reason for the call, the client's number, and what they need from you. Nothing gets lost, even mid-job.",
      recapTitle: "📞 New call received",
      recapBody:
        "A client called requesting an urgent callout.\nNumber: +33 6 XX XX XX XX\nWould like a callback if needed.",
    },
  },
  default: {
    fr: {
      eyebrowHero: "▪ Toujours disponible pour vos clients",
      headline: "Pendant que vous travaillez, qui répond au téléphone ?",
      accrocheHeadline: "Vous, pendant que vous travaillez : qui décroche ?",
      accrocheP1:
        "Beaucoup de petites entreprises tiennent grâce à une seule personne, toujours la même, toujours disponible pour ses clients. C'est une force, et une vraie promesse de qualité.",
      accrocheP2:
        "Le revers, lui, n'est jamais dit à voix haute : quand cette personne est occupée avec un client, personne d'autre n'est là pour décrocher, ni pour une question simple, ni pour une urgence.",
      chips: [
        { label: "Devis", value: "Sur demande" },
        { label: "Urgence", value: "Prioritaire", accent: true },
        { label: "Disponibilité", value: "7j/7" },
        { label: "Zone", value: "Votre secteur" },
      ],
      demoIntro:
        "C'est vous qui appelez ci-dessous : un vrai appel vers Orlane, l'agent vocal de démonstration ByCo. Une fois configuré et personnalisé pour votre activité, votre agent saura restituer ce type d'information, comme dans l'exemple ci-dessous.",
      whatsappBody:
        "Dès que vous raccrochez, un récapitulatif part directement sur WhatsApp : le motif de l'appel, le numéro du client, et ce qu'il attend de vous. Rien ne se perd, même quand vous êtes occupé.",
      recapTitle: "📞 Nouvel appel reçu",
      recapBody:
        "Un client a appelé pour une demande de renseignement.\nNuméro : +33 6 XX XX XX XX\nSouhaite être rappelé si besoin.",
    },
    en: {
      eyebrowHero: "▪ Always available for your clients",
      headline: "While you're working, who answers the phone?",
      accrocheHeadline: "You, while you're working: who picks up?",
      accrocheP1:
        "Many small businesses run on a single person, always the same one, always available for their clients. That's a strength, and a real promise of quality.",
      accrocheP2:
        "The downside is never said out loud: when that person is busy with a client, no one else is there to pick up, not for a simple question, not for an emergency.",
      chips: [
        { label: "Quotes", value: "On request" },
        { label: "Emergency", value: "Priority", accent: true },
        { label: "Availability", value: "7 days a week" },
        { label: "Area", value: "Your region" },
      ],
      demoIntro:
        "You're the one calling below: a real call to Orlane, ByCo's demo voice agent. Once configured and customized for your business, your agent will handle this kind of information, as shown in the example below.",
      whatsappBody:
        "As soon as you hang up, a summary is sent straight to WhatsApp: the reason for the call, the client's number, and what they need from you. Nothing gets lost, even when you're busy.",
      recapTitle: "📞 New call received",
      recapBody:
        "A client called with a general inquiry.\nNumber: +33 6 XX XX XX XX\nWould like a callback if needed.",
    },
  },
};

/* ── Textes de l'interface (indépendants du secteur) ──────────── */

type UIStrings = {
  heroSubtitle: string;
  heroSubtitleProspectTemplate: string;
  demoTag: string;
  accrocheEyebrow: string;
  demoEyebrow: string;
  demoTitle: string;
  chipsLabel: string;
  callButton: string;
  callButtonConnecting: string;
  callButtonActive: string;
  callButtonError: string;
  callNote: string;
  afterCallEyebrow: string;
  afterCallTitle: string;
  waitingMessage: string;
  calledMessage: string;
  notCalledMessage: string;
  sentJustNow: string;
  whatsappHeaderName: string;
  whatsappOnline: string;
  prospectBadgeTemplate: string;
  offerEyebrow: string;
  offerTitleTemplate: string;
  offerDesc: string;
  badgeOfferTemplate: string;
  badgeGuarantee: string;
  badgeTestimonial: string;
  offerFooterNote: string;
  offerFooterLinkText: string;
  whatsappCta: string;
  whatsappCtaNote: string;
  suiviEyebrow: string;
  suiviTitle: string;
  suiviDesc: string;
  suiviName: string;
  suiviContact: string;
  suiviMessage: string;
  suiviSubmit: string;
  suiviThanks: string;
  footerLine1: string;
  footerLine2: string;
};

const UI: Record<Lang, UIStrings> = {
  fr: {
    heroSubtitle: "Une démonstration interactive, adaptée à votre activité.",
    heroSubtitleProspectTemplate: "Une démonstration interactive, préparée pour {name}.",
    demoTag: "Démo ByCo",
    accrocheEyebrow: "Ce que votre site ne dit pas",
    demoEyebrow: "À vous de tester",
    demoTitle: "Testez la technologie qui répondra à vos clients",
    chipsLabel: "Exemple : ce que VOTRE agent saura",
    callButton: "📞 Parler à Orlane",
    callButtonConnecting: "Connexion en cours…",
    callButtonActive: "🔴 Raccrocher",
    callButtonError: "Appel indisponible pour le moment",
    callNote:
      "Un seul effet à ce clic : un appel démarre directement dans votre navigateur avec Orlane, l'assistant de démonstration ByCo, pas un agent déjà configuré pour votre activité.",
    afterCallEyebrow: "Après l'appel",
    afterCallTitle: "Chaque appel devient un message WhatsApp",
    waitingMessage: "En attente de votre appel test…",
    calledMessage: "Message généré suite à votre appel test ci-dessus.",
    notCalledMessage: "Appelez le numéro de démo ci-dessus pour voir ce message apparaître ici.",
    sentJustNow: "Envoyé à l'instant",
    whatsappHeaderName: "Orlane · Assistant ByCo",
    whatsappOnline: "en ligne",
    prospectBadgeTemplate: "Préparé pour {name}",
    offerEyebrow: "Envie d'aller plus loin ?",
    offerTitleTemplate: "Le plan Business+ : {price}",
    offerDesc:
      "Accueil IA disponible 24h/24, automatisation WhatsApp complète, réservation et confirmation automatique, suivi client automatisé, ReadyFlow Manager inclus, voix IA sur-mesure. Mise en place en 48 à 72h. Prix plein, paiement unique, aucun abonnement.",
    badgeOfferTemplate: "Plan Business+ · {price}",
    badgeGuarantee: "Satisfait ou remboursé sous 30 jours, sans condition",
    badgeTestimonial: "Contrepartie : un témoignage vidéo",
    offerFooterNote: "Les formules Essential, Business et Premium restent consultables sur",
    offerFooterLinkText: "le site principal ByCo Systems",
    whatsappCta: "💬 Écrire à Orlane sur WhatsApp",
    whatsappCtaNote: "Même ligne Orlane, cette fois sur WhatsApp : votre message nous parvient directement.",
    suiviEyebrow: "Pas prêt à appeler tout de suite ?",
    suiviTitle: "Laissez-nous vos coordonnées",
    suiviDesc: "Un mot, votre contact, et on revient vers vous — pas besoin d'attendre.",
    suiviName: "Nom",
    suiviContact: "Téléphone ou WhatsApp",
    suiviMessage: "Votre message",
    suiviSubmit: "Envoyer",
    suiviThanks: "Merci, c'est bien reçu — on vous recontacte rapidement.",
    footerLine1: "Démonstration générique · adaptable à votre secteur",
    footerLine2: "Démonstration personnalisable · ByCo Systems · bycosystems.xyz",
  },
  en: {
    heroSubtitle: "An interactive demo, tailored to your business.",
    heroSubtitleProspectTemplate: "An interactive demo, prepared for {name}.",
    demoTag: "ByCo Demo",
    accrocheEyebrow: "What your website doesn't say",
    demoEyebrow: "Your turn to try",
    demoTitle: "Test the technology that will answer your clients",
    chipsLabel: "Example: what YOUR agent will know",
    callButton: "📞 Talk to Orlane",
    callButtonConnecting: "Connecting…",
    callButtonActive: "🔴 Hang up",
    callButtonError: "Call unavailable right now",
    callNote:
      "This click does one thing: a call starts right in your browser with Orlane, the ByCo demo assistant, not an agent already configured for your business.",
    afterCallEyebrow: "After the call",
    afterCallTitle: "Every call becomes a WhatsApp message",
    waitingMessage: "Waiting for your test call…",
    calledMessage: "Message generated from your test call above.",
    notCalledMessage: "Call the demo number above to see this message appear here.",
    sentJustNow: "Sent just now",
    whatsappHeaderName: "Orlane · ByCo Assistant",
    whatsappOnline: "online",
    prospectBadgeTemplate: "Prepared for {name}",
    offerEyebrow: "Want to go further?",
    offerTitleTemplate: "The Business+ plan: {price}",
    offerDesc:
      "24/7 AI reception, full WhatsApp automation, automatic booking and confirmation, automated client follow-up, ReadyFlow Manager included, custom AI voice. Setup in 48 to 72 hours. Full price, one-time payment, no subscription.",
    badgeOfferTemplate: "Business+ plan · {price}",
    badgeGuarantee: "Money-back guarantee within 30 days, no conditions",
    badgeTestimonial: "In exchange: a video testimonial",
    offerFooterNote: "The Essential, Business and Premium plans remain available on",
    offerFooterLinkText: "the main ByCo Systems site",
    whatsappCta: "💬 Message Orlane on WhatsApp",
    whatsappCtaNote: "Same Orlane line, this time on WhatsApp: your message reaches us directly.",
    suiviEyebrow: "Not ready to call right now?",
    suiviTitle: "Leave us your details",
    suiviDesc: "A quick note, your contact, and we'll get back to you — no need to wait.",
    suiviName: "Name",
    suiviContact: "Phone or WhatsApp",
    suiviMessage: "Your message",
    suiviSubmit: "Send",
    suiviThanks: "Thanks, got it — we'll be in touch shortly.",
    footerLine1: "Generic demo · adaptable to your industry",
    footerLine2: "Customizable demo · ByCo Systems · bycosystems.xyz",
  },
};

const META: Record<Secteur, Record<Lang, { title: string; description: string; ogDescription: string }>> = {
  sante: {
    fr: {
      title: "Votre cabinet, toujours disponible × ByCo Systems",
      description:
        "Démonstration interactive de l'agent vocal ByCo pour cabinets médicaux et paramédicaux : testez Orlane en direct.",
      ogDescription: "Pendant votre consultation, qui répond au téléphone ? Testez Orlane en direct.",
    },
    en: {
      title: "Your practice, always available × ByCo Systems",
      description:
        "Interactive demo of the ByCo voice agent for medical and healthcare practices: test Orlane live.",
      ogDescription: "While you're with a patient, who answers the phone? Test Orlane live.",
    },
  },
  urgence: {
    fr: {
      title: "Votre activité, toujours disponible × ByCo Systems",
      description:
        "Démonstration interactive de l'agent vocal ByCo pour artisans et dépanneurs : testez Orlane en direct.",
      ogDescription: "Pendant votre intervention, qui répond au téléphone ? Testez Orlane en direct.",
    },
    en: {
      title: "Your business, always available × ByCo Systems",
      description:
        "Interactive demo of the ByCo voice agent for tradespeople and service businesses: test Orlane live.",
      ogDescription: "While you're on a job, who answers the phone? Test Orlane live.",
    },
  },
  default: {
    fr: {
      title: "Découvrir votre agent d'accueil × ByCo Systems",
      description:
        "Démonstration interactive de la mini-application sur-mesure conçue par ByCo Systems : testez l'agent d'accueil en direct.",
      ogDescription: "Pendant que vous travaillez, qui répond au téléphone ? Testez Orlane en direct.",
    },
    en: {
      title: "Discover your AI receptionist × ByCo Systems",
      description:
        "Interactive demo of the custom mini-app built by ByCo Systems: test the AI receptionist live.",
      ogDescription: "While you're working, who answers the phone? Test Orlane live.",
    },
  },
};

/* ── Composant principal ────────────────────────────────────── */

function DecouvrirDemo() {
  const { secteur: rawSecteur, lang: rawLang, prospect: rawProspect } = Route.useSearch();
  const secteur = resolveSecteur(rawSecteur);
  const lang = resolveLang(rawLang);
  const prospect = resolveProspect(rawProspect);
  const copy = COPY[secteur][lang];
  const ui = UI[lang];
  const [called, setCalled] = useState(false);
  const marche = useMarche();
  const price = priceFor("Business+", marche);

  return (
    <div style={{ fontFamily: SANS, background: C.paper, color: C.ink }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap"
      />
      <Hero copy={copy} ui={ui} prospect={prospect} />
      <Accroche copy={copy} ui={ui} />
      <DemoInteractive copy={copy} ui={ui} called={called} setCalled={setCalled} marche={marche} />
      <WhatsAppConfirmation copy={copy} ui={ui} called={called} />
      <OffreDecouverte ui={ui} price={price} />
      <SuiviForm ui={ui} />
      <Footer ui={ui} />
    </div>
  );
}

/* ── Section 1 — Hero ───────────────────────────────────────── */

function Hero({ copy, ui, prospect }: { copy: Copy; ui: UIStrings; prospect?: string }) {
  const subtitle = prospect
    ? ui.heroSubtitleProspectTemplate.replace("{name}", prospect)
    : ui.heroSubtitle;
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
        <DemoTag label={ui.demoTag} />
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
            {prospect && (
              <div
                style={{
                  display: "inline-block",
                  marginBottom: 14,
                  padding: "5px 14px",
                  borderRadius: 20,
                  background: C.teal,
                  color: "#fff",
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  maxWidth: "100%",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  boxShadow: "0 2px 10px rgba(62,128,115,0.4)",
                }}
              >
                {ui.prospectBadgeTemplate.replace("{name}", prospect)}
              </div>
            )}
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
                overflowWrap: "break-word",
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoTag({ label }: { label: string }) {
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
      {label}
    </div>
  );
}

/* ── Section 2 — Accroche ──────────────────────────────────── */

function Accroche({ copy, ui }: { copy: Copy; ui: UIStrings }) {
  return (
    <Section bg={C.paper}>
      <Container>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <Eyebrow color={C.terracotta} center>
            {ui.accrocheEyebrow}
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
  ui,
  called,
  setCalled,
  marche,
}: {
  copy: Copy;
  ui: UIStrings;
  called: boolean;
  setCalled: (v: boolean) => void;
  marche: Marche;
}) {
  const { status, start, hangup } = useOrlaneCall(marche, () => setCalled(true));
  const buttonLabel =
    status === "connecting"
      ? ui.callButtonConnecting
      : status === "active"
        ? ui.callButtonActive
        : status === "error"
          ? ui.callButtonError
          : ui.callButton;
  const handleClick = () => {
    if (status === "active") hangup();
    else if (status === "idle" || status === "ended" || status === "error") start();
  };
  return (
    <Section bg={C.noir} id="demo">
      <Container>
        <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 34px" }}>
          <Eyebrow color={C.tealLight} center>
            {ui.demoEyebrow}
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
            {ui.demoTitle}
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
            {ui.chipsLabel}
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

          <button
            type="button"
            onClick={handleClick}
            disabled={status === "connecting"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              boxSizing: "border-box",
              padding: "17px 20px",
              borderRadius: 13,
              border: "none",
              cursor: status === "connecting" ? "wait" : "pointer",
              background: status === "active" ? C.terracotta : C.teal,
              color: "#fff",
              fontSize: 15.5,
              fontWeight: 700,
              fontFamily: "inherit",
              textDecoration: "none",
              boxShadow: `0 10px 30px rgba(62,128,115,0.4)`,
              opacity: status === "connecting" ? 0.7 : 1,
            }}
          >
            {buttonLabel}
          </button>
          <div
            style={{
              textAlign: "center",
              marginTop: 12,
              fontSize: 11.5,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {ui.callNote}
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

function WhatsAppConfirmation({
  copy,
  ui,
  called,
}: {
  copy: Copy;
  ui: UIStrings;
  called: boolean;
}) {
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
            <Eyebrow color={C.tealDeep}>{ui.afterCallEyebrow}</Eyebrow>
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
              {ui.afterCallTitle}
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
              {called ? ui.calledMessage : ui.notCalledMessage}
            </p>
          </div>

          <div
            style={{ flex: "1 1 280px", minWidth: 260, display: "flex", justifyContent: "center" }}
          >
            <WhatsAppMock copy={copy} ui={ui} called={called} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function WhatsAppMock({ copy, ui, called }: { copy: Copy; ui: UIStrings; called: boolean }) {
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
            {ui.whatsappHeaderName}
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>{ui.whatsappOnline}</div>
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
            <div style={{ marginTop: 6, fontSize: 10, color: C.inkSoft }}>{ui.sentJustNow}</div>
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
            {ui.waitingMessage}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Section 5 — L'offre ────────────────────────────────────── */

function OffreDecouverte({ ui, price }: { ui: UIStrings; price: string }) {
  const offerTitle = ui.offerTitleTemplate.replace("{price}", price);
  const badgeOffer = ui.badgeOfferTemplate.replace("{price}", price);
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
            {ui.offerEyebrow}
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
            {offerTitle}
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
            {ui.offerDesc}
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
            <OfferBadge>{badgeOffer}</OfferBadge>
            <OfferBadge>{ui.badgeGuarantee}</OfferBadge>
            <OfferBadge>{ui.badgeTestimonial}</OfferBadge>
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
            {ui.offerFooterNote}{" "}
            <a
              href="https://bycosystems.xyz"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {ui.offerFooterLinkText}
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
            {ui.whatsappCta}
          </a>
          <div style={{ marginTop: 12, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            {ui.whatsappCtaNote}
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

/* ── Section 6 — Formulaire de suivi ───────────────────────── */

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mbdbpvyz";

function SuiviForm({ ui }: { ui: UIStrings }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (response.ok) setSubmitted(true);
    } finally {
      setSending(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${C.line}`,
    background: "#fff",
    fontSize: 14,
    fontFamily: SANS,
    color: C.ink,
  };

  return (
    <Section bg={C.paperDeep}>
      <Container>
        <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <Eyebrow color={C.tealDeep} center>
            {ui.suiviEyebrow}
          </Eyebrow>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(22px, 3vw, 28px)",
              color: C.ink,
              fontWeight: 700,
              margin: "10px 0 10px",
            }}
          >
            {ui.suiviTitle}
          </h2>
          <p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.6, margin: "0 0 24px" }}>
            {ui.suiviDesc}
          </p>
          {submitted ? (
            <p style={{ fontSize: 14, color: C.tealDeep, fontWeight: 600 }}>{ui.suiviThanks}</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, textAlign: "left" }}>
              <input type="hidden" name="source" value="demo-decouvrir" />
              <input style={inputStyle} name="name" placeholder={ui.suiviName} required />
              <input style={inputStyle} name="contact" placeholder={ui.suiviContact} required />
              <textarea
                style={{ ...inputStyle, resize: "vertical" }}
                name="message"
                rows={4}
                placeholder={ui.suiviMessage}
                required
              />
              <button
                type="submit"
                disabled={sending}
                style={{
                  padding: "13px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: C.teal,
                  color: "#fff",
                  fontSize: 14.5,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  cursor: sending ? "wait" : "pointer",
                  opacity: sending ? 0.7 : 1,
                }}
              >
                {ui.suiviSubmit}
              </button>
            </form>
          )}
        </div>
      </Container>
    </Section>
  );
}

/* ── Footer ─────────────────────────────────────────────────── */

function Footer({ ui }: { ui: UIStrings }) {
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
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{ui.footerLine1}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{ui.footerLine2}</div>
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
