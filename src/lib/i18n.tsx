import React, { createContext, useContext } from "react";

export type Lang = "en" | "fr";

export interface Content {
  meta: { title: string; description: string; ogDescription: string };
  parallax: { offer: string; services: string; clients: string; demo: string; automation: string; guide: string; plans: string; process: string; contact: string };
  nav: { offer: string; services: string; pricing: string; demo: string; process: string; contact: string; cta: string };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    bullets: [string, string, string];
  };
  stats: { setupLabel: string; receptionLabel: string; industriesLabel: string };
  coreOffer: {
    heading: string;
    subheading: string;
    pillars: { title: string; desc: string }[];
    ctaDashboard: string;
    ctaNote: string;
  };
  services: { heading: string; items: { title: string; desc: string }[] };
  whoWeServe: { heading: string; subheading: string };
  smartIntakeDemo: {
    heading: string;
    subheading: string;
    benefits: { title: string; desc: string }[];
    steps: { n: string; title: string; desc: string }[];
    cta: string;
    note: string;
  };
  featuredDemo: {
    liveHeading: string;
    liveSubtext: string;
    exploreDemoCta: string;
    whatsappCta: string;
    liveNote: string;
    heading: string;
    subheading: string;
    features: string[];
    cta: string;
    chatMsg1: string;
    chatReply1: string;
    chatMsg2: string;
    chatReply2: string;
  };
  pricing: {
    heading: string;
    subheading: string;
    plans: { name: string; price: string; subtitle: string; desc: string; features: string[]; cta: string; badge: string | null }[];
    guarantee: string;
    footerNote: string;
    footerLinkText: string;
  };
  process: { heading: string; steps: { n: string; title: string; desc: string; day: string }[] };
  faq: { heading: string; tagline: string; items: { q: string; a: string }[] };
  contact: {
    heading: string;
    subheading: string;
    whatsapp: string;
    responseTime: string;
    responseNote: string;
    formName: string;
    formBusiness: string;
    formEmail: string;
    formPhone: string;
    formMessage: string;
    formSubmit: string;
    formThanks: string;
    founderName: string;
    founderRole: string;
    founderBio: string;
  };
  footer: { tagline: string; rights: string; siege: string };
}

export const content: Record<Lang, Content> = {
  en: {
    meta: {
      title: "ByCo Systems - Smart Reception & Automation for Service Businesses",
      description:
        "ByCo Systems builds smart reception systems, WhatsApp automation, booking flows and intelligent phone intake for service businesses.",
      ogDescription: "Never miss a client again. Smart reception systems that run 24/7 for clinics, salons, agencies and every service business.",
    },
    parallax: { offer: "OFFER", services: "SERVICES", clients: "CLIENTS", demo: "DEMO", automation: "AUTOMATION", guide: "GUIDE", plans: "PLANS", process: "PROCESS", contact: "CONTACT" },
    nav: { offer: "What we build", services: "Services", pricing: "Pricing", demo: "Demo", process: "Process", contact: "Contact", cta: "Contact us" },
    hero: {
      badge: "Smart reception & automation for service businesses",
      titleLine1: "Never miss",
      titleLine2: "a client again.",
      titleLine3: "24/7.",
      subtitle: "Smart phone reception, WhatsApp automation, booking flows and follow-up systems - built for clinics, salons, agencies and every service business.",
      ctaPrimary: "Contact us",
      ctaSecondary: "See our plans",
      bullets: ["Zero missed calls", "WhatsApp automation", "One-time payment, tailored setup"],
    },
    stats: {
      setupLabel: "Full setup, done for you",
      receptionLabel: "Smart phone reception",
      industriesLabel: "Automated channels",
    },
    coreOffer: {
      heading: "Your front desk, running 24/7 without extra staff",
      subheading: "Every missed call, unanswered WhatsApp or forgotten follow-up is a client your competitor just won.",
      pillars: [
        { title: "Intelligent phone reception", desc: "Never miss a call again. Your smart receptionist answers, qualifies and routes every call automatically." },
        { title: "WhatsApp & multi-channel automation", desc: "Instant greetings, appointment confirmations and follow-ups on WhatsApp - without lifting a finger." },
        { title: "Automated booking & follow-up", desc: "Clients book, get confirmed and receive reminders automatically. Your calendar fills itself." },
      ],
      ctaDashboard: "Preview the ReadyFlow Manager concept",
      ctaNote: "Concept preview - explore freely, no login required.",
    },
    services: {
      heading: "Everything your front desk should do - automated",
      items: [
        { title: "Smart Phone Reception", desc: "Intelligent phone intake that answers, qualifies and routes calls automatically - 24/7, no extra staff." },
        { title: "WhatsApp Automation", desc: "Instant greetings, appointment confirmations, lead capture and follow-up sequences on WhatsApp." },
        { title: "Booking & Intake Systems", desc: "Clients book online, get confirmed instantly, receive reminders automatically. Zero manual work." },
        { title: "ReadyFlow Manager", desc: "See every call and WhatsApp exchange Orlane handles, logged automatically so nothing gets lost." },
        { title: "AI Client Assistant", desc: "Handles visitor questions directly, qualifies the request and responds without delay." },
        { title: "Custom Automation Flows", desc: "Connect your tools, automate repetitive tasks and keep your business running while you focus on delivery." },
      ],
    },
    whoWeServe: {
      heading: "When someone needs you urgently, do they reach you, or call the next name on the list?",
      subheading: "Every unanswered call is a client you never knew you lost. This applies to all service businesses. If your business can't afford a missed call, ByCo Systems makes sure every request gets a response, 24/7.",
    },
    smartIntakeDemo: {
      heading: "See how a 24/7 smart intake handles real customer requests",
      subheading: "This example shows how a business handles incoming requests automatically - so when you step in, the context is already there.",
      benefits: [
        { title: "24/7 Availability", desc: "Orlane never sleeps. Capture business while you rest, without extra headcount." },
        { title: "Phone and WhatsApp", desc: "One system, both channels - calls and messages handled the same way." },
        { title: "Smart Qualification", desc: "Orlane asks the right questions and flags what's urgent." },
        { title: "Custom Voice and Script", desc: "Built for your business, not a generic assistant." },
        { title: "Every Exchange Logged", desc: "ReadyFlow Manager tracks every call and message automatically." },
        { title: "One-Time Payment", desc: "One-time payment for the setup, with no monthly service fee from us. Usage costs are billed directly by the providers, on accounts in your name." },
      ],
      steps: [
        { n: "01", title: "Capture", desc: "AI collects requests from WhatsApp, phone or your website instantly." },
        { n: "02", title: "Process", desc: "Reads what's urgent, what can wait, and what needs a callback." },
        { n: "03", title: "Organize", desc: "The request is logged with a clear summary, ready to follow up." },
      ],
      cta: "Request a similar system",
      note: "Demo video in French, fully subtitled in English - adaptable to clinics, salons, agencies and any service business.",
    },
    featuredDemo: {
      liveHeading: "See Orlane in action",
      liveSubtext: "This is a simplified demo we built. Explore it, then call or WhatsApp our demo receptionist.",
      exploreDemoCta: "Explore the demo",
      whatsappCta: "Call or WhatsApp +44 7576 594092",
      liveNote: "Our demo receptionist answers 24/7. It's a preview of the concept behind what we build for service businesses like yours.",
      heading: "See exactly who Orlane talked to, and what happened next",
      subheading: "ReadyFlow Manager logs every call and WhatsApp exchange automatically - included free from Business, so nothing gets lost after the conversation ends.",
      features: ["Every call logged automatically", "Every WhatsApp exchange saved", "Clear status: new, in progress, handled", "Know who to follow up with", "No spreadsheets, no sticky notes", "Included free from Business"],
      cta: "See ReadyFlow Manager",
      chatMsg1: "Hi, do you have availability this week?",
      chatReply1: "Yes! What day works best for you?",
      chatMsg2: "Thursday afternoon if possible",
      chatReply2: "Perfect, I’ve got you down for Thursday. Logged in ReadyFlow Manager ✓",
    },
    pricing: {
      heading: "Simple, transparent pricing",
      subheading: "One-time payment for the setup, with no monthly service fee from us.",
      plans: [
        {
          name: "Essential",
          price: "490€",
          subtitle: "Get found online, before losing that first click",
          desc: "A prospect searching online who can't find you, or lands on a site that looks abandoned, moves to the next result in seconds. Essential puts a real, professional site in front of them - whether we build it from scratch or give your current one a thorough professional overhaul - so the first impression works for you instead of against you.",
          features: [
            "Professional website built from scratch, or a full professional overhaul if you already have one",
            "Online client intake form - every visitor can reach you in one click",
            "Booking system with automatic reminders - fewer no-shows, fuller calendar",
            "Request tracking dashboard - see who reached out and follow up",
            "Setup in 1 to 2 weeks, testing and validation included",
          ],
          cta: "Request this system",
          badge: null,
        },
        {
          name: "Business",
          price: "990€",
          subtitle: "A tireless assistant, behind the WhatsApp you already use",
          desc: "WhatsApp is already on your phone, day and night - but so are you, and you can't always answer. Business puts an intelligent assistant behind that same number, one that replies instantly and wisely, asks the right questions, and books the appointment while you sleep, eat, or work the job in front of you. Every message answered is a client who didn't go looking elsewhere.",
          features: [
            "Everything in Essential",
            "An AI assistant on WhatsApp - replies and qualifies every message, 24/7",
            "Automatic routing so nothing sits unanswered",
            "🎁 ReadyFlow Manager included - every conversation logged automatically, so you always know who to follow up with",
            "Setup in 3 to 4 weeks, testing and validation included",
          ],
          cta: "Request this system",
          badge: null,
        },
        {
          name: "Business+",
          price: "1 490€",
          subtitle: "The call that almost got away, answered instead",
          desc: "Someone who picks up the phone instead of texting is often your most urgent prospect - and the most likely to hang up and dial the next name on the list if nobody answers. Business+ makes sure that call is never the one you lose, with a voice and script built specifically for your business, not a generic one, plugged straight into the tools you already use.",
          features: [
            "Everything in Business",
            "AI phone reception, 24/7, custom voice and script built for your business",
            "Integration with your existing tools (CRM, calendar) - nothing to re-enter",
            "Setup in 30 to 45 days, testing and validation included",
          ],
          cta: "Request this system",
          badge: "⭐ Recommended",
        },
        {
          name: "Premium",
          price: "1 990€",
          subtitle: "Built around how you actually work, not a generic script",
          desc: "A generic script can misjudge what's actually urgent for your business. Premium starts with a full look at how you triage requests today, then builds the system around that - not a one-size-fits-all version. And for 30 days after launch, we're still adjusting things with you, not gone the day after delivery.",
          features: [
            "Everything in Business+",
            "Full audit of your current workflow before we build anything",
            "Scenarios designed around how you specifically triage requests",
            "30 days of post-delivery support and adjustments included",
            "Priority delivery",
            "Setup in 45 days maximum, testing and validation included",
          ],
          cta: "Request this system",
          badge: null,
        },
      ],
      guarantee: "30-day money-back guarantee, starting once your setup is completed, no conditions.",
      footerNote: "Need a custom system?",
      footerLinkText: "Talk to us - we adapt to every service business.",
    },
    process: {
      heading: "How Orlane goes live for your business",
      steps: [
        { n: "01", title: "We learn your business", desc: "Your services, hours, and how you tell an emergency from a routine request.", day: "Scoping" },
        { n: "02", title: "Orlane goes live", desc: "Answering calls and WhatsApp messages with a voice and script built for you.", day: "Configuration" },
        { n: "03", title: "We fine-tune together", desc: "Real conversations reveal small adjustments. We refine based on how it's actually used.", day: "Testing & validation" },
        { n: "04", title: "You never miss a call again", desc: "Delivered and answering for you, start to finish.", day: "Delivery" },
      ],
    },
    faq: {
      heading: "Common questions",
      tagline: "Straight answers, no fluff.",
      items: [
        {
          q: "Why not just use a €49/month subscription tool?",
          a: "It's a fair question. With us, it's a one-time payment for the setup, with no monthly service fee from us. Usage costs for the tools (calls, messages, voice, AI) are billed directly by their providers, on accounts in your name. One recovered client on a Saturday night can cover the whole setup.",
        },
        {
          q: "Does this work for my type of business?",
          a: "If clients call you, message you or book with you, yes. We work with service businesses of every kind, and we adapt the system to how your business actually operates.",
        },
        {
          q: "How long until I'm up and running?",
          a: "1 to 2 weeks for Essential. 3 to 4 weeks for Business. 30 to 45 days for Business+. 45 days maximum for Premium. Testing and validation are included at every level. For Business, Business+ and Premium, that also includes approval from Meta and our technical partners, and from your telecom operator if we set things up on your existing number. Essential only needs our own testing and validation. Those external steps aren't something we control.",
        },
        {
          q: "What happens after delivery?",
          a: "The system runs on its own - there's nothing for you to manage after that. You're also covered by a 30-day money-back guarantee, starting once your setup is completed, no conditions. Premium adds 30 days of support and adjustments on top of that. Every plan includes a handover walkthrough.",
        },
        {
          q: "Can I see it working before I buy?",
          a: "Yes, you can try the concept demo any time - call or WhatsApp +44 7576 594092 to talk to our demo receptionist. It shows how the technology works, not a system already built for your business. If you'd like to go further, use the contact form and we'll follow up.",
        },
      ],
    },
    contact: {
      heading: "Contact us",
      subheading: "Tell us your biggest reception headache. We'll show you exactly what we can automate.",
      whatsapp: "Chat with us on WhatsApp",
      responseTime: "Response within 72 hours",
      responseNote: "We review every request and get back to you with a clear proposal.",
      formName: "Name",
      formBusiness: "Business",
      formEmail: "Email",
      formPhone: "Phone / WhatsApp",
      formMessage: "Message",
      formSubmit: "Send request",
      formThanks: "Thanks - we'll be in touch soon!",
      founderName: "Samuel Boumso",
      founderRole: "founder of ByCo Systems",
      founderBio: "I support every project through the setup of its intelligent reception system.",
    },
    footer: {
      tagline: "Smart reception systems, WhatsApp automation and call tracking for service businesses.",
      rights: "All rights reserved.",
      siege: "ByCo Systems operates online. Headquarters: Douala, Cameroon.",
    },
  },
  fr: {
    meta: {
      title: "ByCo Systems - Réception intelligente et automatisation pour entreprises de services",
      description:
        "ByCo Systems conçoit des systèmes de réception intelligente, l'automatisation WhatsApp, des parcours de réservation et un accueil téléphonique intelligent pour les entreprises de services.",
      ogDescription: "Ne manquez plus jamais un client. Des systèmes de réception intelligente actifs 24h/24 pour cliniques, salons, agences et toute entreprise de services.",
    },
    parallax: { offer: "OFFRE", services: "SERVICES", clients: "CLIENTS", demo: "DÉMO", automation: "AUTOMATISATION", guide: "GUIDE", plans: "TARIFS", process: "MÉTHODE", contact: "CONTACT" },
    nav: { offer: "Notre offre", services: "Services", pricing: "Tarifs", demo: "Démo", process: "Méthode", contact: "Contact", cta: "Nous contacter" },
    hero: {
      badge: "Réception intelligente et automatisation pour entreprises de services",
      titleLine1: "Ne manquez plus",
      titleLine2: "jamais un client.",
      titleLine3: "24/7.",
      subtitle: "Réception intelligente et automatisation pour entreprises de services : appels, WhatsApp et rendez-vous gérés 24h/24.",
      ctaPrimary: "Nous contacter",
      ctaSecondary: "Voir les offres",
      bullets: ["Zéro appel manqué", "Automatisation WhatsApp", "Paiement unique, mise en place sur mesure"],
    },
    stats: {
      setupLabel: "Mise en place complète, clé en main",
      receptionLabel: "Réception téléphonique intelligente",
      industriesLabel: "Canaux automatisés",
    },
    coreOffer: {
      heading: "Votre accueil, actif 24h/24 sans personnel supplémentaire",
      subheading: "Chaque appel manqué, message WhatsApp sans réponse ou relance oubliée est un client que votre concurrent vient de gagner.",
      pillars: [
        { title: "Réception téléphonique intelligente", desc: "Ne manquez plus jamais un appel. Votre réceptionniste intelligent répond, qualifie et redirige chaque appel automatiquement." },
        { title: "Automatisation WhatsApp et multi-canal", desc: "Accueil instantané, confirmations de rendez-vous et relances sur WhatsApp - sans lever le petit doigt." },
        { title: "Réservation et suivi automatisés", desc: "Vos clients réservent, sont confirmés et reçoivent des rappels automatiquement. Votre agenda se remplit tout seul." },
      ],
      ctaDashboard: "Découvrir le concept ReadyFlow Manager",
      ctaNote: "Aperçu du concept - explorez librement, sans connexion requise.",
    },
    services: {
      heading: "Tout ce que votre accueil devrait faire - automatisé",
      items: [
        { title: "Réception téléphonique intelligente", desc: "Accueil téléphonique intelligent qui répond, qualifie et redirige les appels automatiquement - 24h/24, sans personnel supplémentaire." },
        { title: "Automatisation WhatsApp", desc: "Accueil instantané, confirmations de rendez-vous, capture de prospects et séquences de relance sur WhatsApp." },
        { title: "Réservation et prise en charge", desc: "Vos clients réservent en ligne, sont confirmés instantanément et reçoivent des rappels automatiquement. Zéro travail manuel." },
        { title: "ReadyFlow Manager", desc: "Voyez chaque appel et échange WhatsApp traité par Orlane, enregistré automatiquement pour que rien ne se perde." },
        { title: "Assistant client IA", desc: "Répond aux questions des visiteurs directement, qualifie la demande et réagit sans délai." },
        { title: "Flux d'automatisation sur mesure", desc: "Connectez vos outils, automatisez les tâches répétitives et gardez votre activité fluide pendant que vous vous concentrez sur l'essentiel." },
      ],
    },
    whoWeServe: {
      heading: "Quand quelqu'un a besoin de vous en urgence, décroche-t-il, ou appelle-t-il le suivant sur la liste ?",
      subheading: "Chaque appel sans réponse est un client perdu que vous ne verrez jamais. Cela concerne toutes les entreprises de services. Si votre métier ne tolère pas un appel manqué, ByCo Systems veille à ce que chaque demande reçoive une réponse, 24h/24.",
    },
    smartIntakeDemo: {
      heading: "Découvrez comment un accueil intelligent 24h/24 traite de vraies demandes clients",
      subheading: "Cet exemple montre comment une entreprise traite automatiquement les demandes entrantes - pour qu'au moment où vous intervenez, le contexte est déjà là.",
      benefits: [
        { title: "Disponible 24h/24", desc: "Orlane ne dort jamais. Captez de l'activité même quand vous vous reposez, sans embaucher." },
        { title: "Téléphone et WhatsApp", desc: "Un seul système, deux canaux - appels et messages traités de la même façon." },
        { title: "Qualification intelligente", desc: "Orlane pose les bonnes questions et repère ce qui est urgent." },
        { title: "Voix et script sur-mesure", desc: "Construits pour votre entreprise, pas un assistant générique." },
        { title: "Chaque échange enregistré", desc: "ReadyFlow Manager trace chaque appel et message automatiquement." },
        { title: "Paiement unique", desc: "Paiement unique pour la mise en place, sans frais de service mensuel de notre part. Les coûts d'usage sont facturés directement par les fournisseurs, sur des comptes à votre nom." },
      ],
      steps: [
        { n: "01", title: "Capture", desc: "L'IA collecte les demandes depuis WhatsApp, le téléphone ou votre site web instantanément." },
        { n: "02", title: "Traitement", desc: "Lit ce qui est urgent, ce qui peut attendre, ce qui demande un rappel." },
        { n: "03", title: "Organisation", desc: "La demande est enregistrée avec un résumé clair, prête à être suivie." },
      ],
      cta: "Demander un système similaire",
      note: "Vidéo de démonstration, sous-titrée en anglais - exemple adaptable aux cliniques, salons, agences et toute entreprise de services.",
    },
    featuredDemo: {
      liveHeading: "Découvrez Orlane en action",
      liveSubtext: "Voici une démo simplifiée que nous avons construite. Explorez-la, puis appelez ou écrivez à notre réceptionniste de démonstration.",
      exploreDemoCta: "Explorer la démo",
      whatsappCta: "Appeler ou WhatsApp +44 7576 594092",
      liveNote: "Notre réceptionniste de démo répond 24h/24. C'est un aperçu du concept derrière ce que nous construisons pour les entreprises de services comme la vôtre.",
      heading: "Voyez exactement à qui Orlane a parlé, et ce qui s'est passé ensuite",
      subheading: "ReadyFlow Manager enregistre automatiquement chaque appel et échange WhatsApp - inclus gratuitement dès Business, pour que rien ne se perde une fois la conversation terminée.",
      features: ["Chaque appel enregistré automatiquement", "Chaque échange WhatsApp sauvegardé", "Statut clair : nouveau, en cours, traité", "Savoir qui relancer, toujours", "Ni tableur, ni post-it", "Inclus gratuitement dès Business"],
      cta: "Découvrir ReadyFlow Manager",
      chatMsg1: "Bonjour, avez-vous de la disponibilité cette semaine ?",
      chatReply1: "Oui ! Quel jour vous conviendrait le mieux ?",
      chatMsg2: "Jeudi après-midi si possible",
      chatReply2: "Parfait, c'est noté pour jeudi. Enregistré dans ReadyFlow Manager ✓",
    },
    pricing: {
      heading: "Des tarifs simples et transparents",
      subheading: "Paiement unique pour la mise en place, sans frais de service mensuel de notre part.",
      plans: [
        {
          name: "Essential",
          price: "490€",
          subtitle: "Soyez trouvé en ligne, avant de perdre ce premier clic",
          desc: "Un prospect qui vous cherche en ligne sans vous trouver, ou qui tombe sur un site à l'abandon, passe au résultat suivant en quelques secondes. Essential met un vrai site professionnel devant lui - que ce soit une construction depuis zéro ou un toilettage professionnel complet de celui que vous avez déjà - pour que la première impression joue pour vous, pas contre vous.",
          features: [
            "Site web professionnel construit depuis zéro, ou toilettage professionnel complet si vous en avez déjà un",
            "Formulaire de prise en charge en ligne - chaque visiteur peut vous joindre en un clic",
            "Système de réservation avec rappels automatiques - moins d'absences, un agenda plus rempli",
            "Tableau de bord de suivi des demandes - voyez qui vous a contacté et relancez",
            "Mise en place en 1 à 2 semaines, tests et validations inclus",
          ],
          cta: "Demander cette offre",
          badge: null,
        },
        {
          name: "Business",
          price: "990€",
          subtitle: "Un assistant infatigable, derrière le WhatsApp que vous avez déjà",
          desc: "WhatsApp est déjà sur votre téléphone, jour et nuit - mais vous aussi, et vous ne pouvez pas toujours répondre. Business installe un assistant intelligent derrière ce même numéro, qui répond instantanément et intelligemment, pose les bonnes questions, et prend le rendez-vous pendant que vous dormez, mangez, ou êtes déjà sur un chantier. Chaque message traité est un client qui n'est pas allé voir ailleurs.",
          features: [
            "Tout Essential",
            "Un assistant IA sur WhatsApp - répond et qualifie chaque message, 24h/24",
            "Redirection automatique - rien ne reste sans réponse",
            "🎁 ReadyFlow Manager inclus - chaque conversation enregistrée automatiquement, vous savez toujours qui relancer",
            "Mise en place en 3 à 4 semaines, tests et validations inclus",
          ],
          cta: "Demander cette offre",
          badge: null,
        },
        {
          name: "Business+",
          price: "1 490€",
          subtitle: "L'appel qu'on a failli perdre, décroché à la place",
          desc: "Quelqu'un qui décroche son téléphone plutôt que d'écrire est souvent votre prospect le plus pressé - et le plus susceptible de raccrocher pour appeler le nom suivant sur sa liste si personne ne répond. Business+ fait en sorte que cet appel-là ne soit jamais celui que vous perdez, avec une voix et un script construits spécifiquement pour votre entreprise, pas une version générique, connectés directement à vos outils habituels.",
          features: [
            "Tout Business",
            "Réception téléphonique IA, 24h/24, voix et script sur-mesure pour votre entreprise",
            "Intégration avec vos outils existants (CRM, calendrier) - rien à ressaisir",
            "Mise en place en 30 à 45 jours, tests et validations inclus",
          ],
          cta: "Demander cette offre",
          badge: "⭐ Recommandée",
        },
        {
          name: "Premium",
          price: "1 990€",
          subtitle: "Construit autour de votre façon de travailler, pas un script générique",
          desc: "Un script générique peut mal juger ce qui est vraiment urgent pour votre activité. Premium commence par un vrai regard sur la façon dont vous triez vos demandes aujourd'hui, puis construit le système autour de ça - pas une version universelle. Et pendant 30 jours après la mise en ligne, on continue d'ajuster avec vous, pas partis le lendemain de la livraison.",
          features: [
            "Tout Business+",
            "Audit complet de votre fonctionnement actuel avant toute construction",
            "Scénarios pensés autour de votre façon précise de trier les demandes",
            "30 jours de support et d'ajustements post-livraison inclus",
            "Livraison prioritaire",
            "Mise en place en 45 jours maximum, tests et validations inclus",
          ],
          cta: "Demander cette offre",
          badge: null,
        },
      ],
      guarantee: "Garantie satisfait ou remboursé de 30 jours, à compter de la mise en place achevée, sans condition.",
      footerNote: "Besoin d'un système sur mesure ?",
      footerLinkText: "Parlez-nous - nous nous adaptons à toute entreprise de services.",
    },
    process: {
      heading: "Comment Orlane démarre chez vous",
      steps: [
        { n: "01", title: "Nous apprenons votre activité", desc: "Vos services, vos horaires, et comment vous distinguez une urgence d'une demande courante.", day: "Cadrage" },
        { n: "02", title: "Orlane démarre", desc: "Elle répond aux appels et messages WhatsApp avec une voix et un script construits pour vous.", day: "Configuration" },
        { n: "03", title: "On ajuste ensemble", desc: "Les vrais échanges révèlent de petits ajustements. On affine selon l'usage réel.", day: "Tests et validations" },
        { n: "04", title: "Vous ne manquez plus jamais un appel", desc: "Livré et opérationnel pour vous, du début à la fin.", day: "Livraison" },
      ],
    },
    faq: {
      heading: "Questions fréquentes",
      tagline: "Des réponses directes, sans blabla.",
      items: [
        {
          q: "Pourquoi pas un outil à 49€/mois ?",
          a: "C'est une vraie question. Chez nous, c'est un paiement unique pour la mise en place, sans frais de service mensuel de notre part. Les coûts d'usage des outils (appels, messages, voix, IA) sont facturés directement par leurs fournisseurs, sur des comptes à votre nom. Un seul client récupéré un samedi soir peut rembourser toute la mise en place.",
        },
        {
          q: "Est-ce adapté à mon type d'activité ?",
          a: "Si des clients vous appellent, vous écrivent ou réservent chez vous, oui. Nous nous adressons à toutes les entreprises de services, et nous adaptons le système à votre façon de travailler.",
        },
        {
          q: "Combien de temps avant d'être opérationnel ?",
          a: "1 à 2 semaines pour Essential. 3 à 4 semaines pour Business. 30 à 45 jours pour Business+. 45 jours maximum pour Premium. Les tests et validations sont inclus à chaque niveau. Pour Business, Business+ et Premium, cela inclut aussi les validations de Meta et de nos partenaires techniques, et celle de votre opérateur télécom si le système est installé sur votre numéro existant. Essential ne demande que nos propres tests et validations. Ces étapes externes ne dépendent pas de nous.",
        },
        {
          q: "Que se passe-t-il après la livraison ?",
          a: "Le système fonctionne seul, vous n'avez rien à gérer ensuite. Vous bénéficiez aussi d'une garantie satisfait ou remboursé de 30 jours, à compter de la mise en place achevée, sans condition. L'offre Premium ajoute 30 jours de support et d'ajustements. Toutes les offres incluent une prise en main guidée.",
        },
        {
          q: "Puis-je le voir fonctionner avant d'acheter ?",
          a: "Oui, vous pouvez essayer la démonstration du concept à tout moment : appelez ou écrivez au +44 7576 594092 pour parler à notre réceptionniste de démo. Elle montre comment la technologie fonctionne, pas un système déjà construit pour votre activité. Pour aller plus loin, utilisez le formulaire de contact et nous reviendrons vers vous.",
        },
      ],
    },
    contact: {
      heading: "Nous contacter",
      subheading: "Parlez-nous de votre plus gros casse-tête d'accueil. Nous vous montrerons exactement ce que nous pouvons automatiser.",
      whatsapp: "Discuter sur WhatsApp",
      responseTime: "Réponse sous 72 heures maximum",
      responseNote: "Nous étudions chaque demande et revenons vers vous avec une proposition claire.",
      formName: "Nom",
      formBusiness: "Entreprise",
      formEmail: "Email",
      formPhone: "Téléphone / WhatsApp",
      formMessage: "Message",
      formSubmit: "Envoyer la demande",
      formThanks: "Merci - nous revenons vers vous très vite !",
      founderName: "Samuel Boumso",
      founderRole: "fondateur de ByCo Systems",
      founderBio: "J'accompagne chaque projet dans la mise en place de son système d'accueil intelligent.",
    },
    footer: {
      tagline: "Systèmes de réception intelligente, automatisation WhatsApp et suivi des échanges pour entreprises de services.",
      rights: "Tous droits réservés.",
      siege: "ByCo Systems opère en ligne. Siège social : Douala, Cameroun.",
    },
  },
};

const LangContext = createContext<Lang>("en");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang(): Lang {
  return useContext(LangContext);
}

export function useContent(): Content {
  return content[useContext(LangContext)];
}

export function localePath(lang: Lang, path: string = "/"): string {
  return lang === "fr" ? `/fr${path === "/" ? "" : path}` : path;
}
