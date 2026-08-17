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
  smartIntakeIntro: {
    heading: string;
    subheading: string;
    benefits: string[];
    cta: string;
    note: string;
    chatOnline: string;
    chatGreeting: string;
    chatUserMsg: string;
    chatFollowup: string;
    chatQualified: string;
    chatRouted: string;
    chatType: string;
    chatTypeValue: string;
    chatPriority: string;
    chatPriorityValue: string;
  };
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
  };
  pricing: {
    heading: string;
    subheading: string;
    plans: { name: string; price: string; subtitle: string; desc: string; features: string[]; cta: string; badge: string | null }[];
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
  footer: { tagline: string; rights: string };
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
    nav: { offer: "What we build", services: "Services", pricing: "Pricing", demo: "Demo", process: "Process", contact: "Contact", cta: "Request a Demo" },
    hero: {
      badge: "Smart reception & automation for service businesses",
      titleLine1: "Never miss",
      titleLine2: "a client again.",
      titleLine3: "24/7.",
      subtitle: "Smart phone reception, WhatsApp automation, booking flows and follow-up systems - built for clinics, salons, agencies and every service business.",
      ctaPrimary: "Request a Demo",
      ctaSecondary: "See our plans",
      bullets: ["Zero missed calls", "WhatsApp automation", "Fast setup - 24-72h"],
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
        { title: "Operations Dashboards", desc: "Track requests, teams and daily operations from one clear interface." },
        { title: "AI Client Assistant", desc: "Conversational AI that guides visitors, qualifies requests and provides immediate responses." },
        { title: "Custom Automation Flows", desc: "Connect your tools, automate repetitive tasks and keep your business running while you focus on delivery." },
      ],
    },
    whoWeServe: {
      heading: "When someone needs you urgently, do they reach you, or call the next name on the list?",
      subheading: "Every unanswered call is a client you never knew you lost. Locksmiths, plumbers, emergency vets, healthcare practices, and many others. If your business can't afford a missed call, ByCo Systems makes sure every request gets a response, 24/7.",
    },
    smartIntakeIntro: {
      heading: "Your 24/7 intelligent receptionist",
      subheading: "Captures, qualifies and routes every client request automatically - by phone, WhatsApp or web form.",
      benefits: ["24/7 customer intake", "Request qualification", "Faster response coordination"],
      cta: "Request AI intake demo",
      note: "Private workflow demo available on request.",
      chatOnline: "Smart Intake · Online",
      chatGreeting: "Hi! How can we help you today?",
      chatUserMsg: "I need a quote for a service appointment next week.",
      chatFollowup: "Got it. Could you share your name, contact and preferred day?",
      chatQualified: "Qualified request",
      chatRouted: "Routed to team",
      chatType: "Type",
      chatTypeValue: "Service quote",
      chatPriority: "Priority",
      chatPriorityValue: "Standard",
    },
    smartIntakeDemo: {
      heading: "See how a 24/7 smart intake handles real customer requests",
      subheading: "This example shows how a business can receive, guide and qualify customer requests automatically before human intervention.",
      benefits: [
        { title: "24/7 Availability", desc: "Your intake process never sleeps. Capture business while you rest, without extra headcount." },
        { title: "Multi-Channel Sync", desc: "Integrate with WhatsApp, Email, and your website with one centralized smart dashboard." },
        { title: "Smart Qualification", desc: "AI automatically scores and categorizes requests based on urgency, priority, and business fit." },
        { title: "AI Intake Assistant", desc: "Conversational AI that captures request details and provides immediate feedback to customers." },
        { title: "Unified Analytics", desc: "Get real-time insights into request volume, lead quality, and conversion performance." },
        { title: "Enterprise Security", desc: "Data encryption ensures your customer information is always safe and compliant." },
      ],
      steps: [
        { n: "01", title: "Capture", desc: "AI collects requests from WhatsApp, phone or your website instantly." },
        { n: "02", title: "Process", desc: "Advanced AI extracts intent, urgency and priority in milliseconds." },
        { n: "03", title: "Organize", desc: "Request is assigned to the right team with a clear AI summary." },
      ],
      cta: "Request a similar system",
      note: "French demo video - example adaptable to clinics, salons, agencies and any service business.",
    },
    featuredDemo: {
      liveHeading: "Live system — built for a real restaurant",
      liveSubtext: "This is a real demo we built. Explore it, then call or WhatsApp our demo receptionist.",
      exploreDemoCta: "Explore the demo",
      whatsappCta: "Call or WhatsApp +44 7576 594092",
      liveNote: "Our demo receptionist answers 24/7. This is exactly what we build for your business.",
      heading: "Your free operational dashboard - included from Business",
      subheading: "Track client requests, assign tasks to your team and monitor your activity in real time. Simple, clear, ready from day one.",
      features: ["Task tracking", "Unit management", "Workflow organization", "Team coordination", "Operational visibility", "Request management"],
      cta: "Explore workspace",
    },
    pricing: {
      heading: "Simple, transparent pricing",
      subheading: "One-time setup. No monthly fees. No surprises.",
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
            "Setup in 24h",
          ],
          cta: "Request this system",
          badge: null,
        },
        {
          name: "Business",
          price: "990€",
          subtitle: "A tireless assistant, behind the WhatsApp you already use",
          desc: "WhatsApp is already on your phone, day and night - but so are you, and you can't always answer. Business puts an intelligent assistant behind that same number, one that replies instantly, asks the right questions, and books the appointment while you sleep, eat, or work the job in front of you. Every message answered is a client who didn't go looking elsewhere.",
          features: [
            "Everything in Essential",
            "An AI assistant on WhatsApp - replies and qualifies every message, 24/7",
            "Automatic routing so nothing sits unanswered",
            "🎁 ReadyFlow Manager included - every conversation logged automatically, so you always know who to follow up with",
            "Setup in 48h",
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
            "Setup in 48-72h",
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
            "Setup in 72h",
          ],
          cta: "Request this system",
          badge: null,
        },
      ],
      footerNote: "Need a custom system?",
      footerLinkText: "Talk to us - we adapt to every service business.",
    },
    process: {
      heading: "How projects move from idea to usable system",
      steps: [
        { n: "01", title: "Understand the workflow", desc: "We map how your team actually works today.", day: "Day 1" },
        { n: "02", title: "Build a practical first version", desc: "A focused, usable system - not an oversized platform.", day: "Day 1–2" },
        { n: "03", title: "Adapt the system to the business", desc: "Refine details based on real day-to-day usage.", day: "Day 2–3" },
        { n: "04", title: "Deliver a clear and usable operational tool", desc: "A system your team can rely on from day one.", day: "Delivered in 24–72h" },
      ],
    },
    faq: {
      heading: "Common questions",
      tagline: "Straight answers — no fluff.",
      items: [
        {
          q: "Why not just use a €49/month subscription tool?",
          a: "Those tools require setup, maintenance and ongoing fees. We build it, configure it and hand it over. One payment. Runs forever. One recovered client on a Saturday night pays for the whole thing.",
        },
        {
          q: "Does this work for my type of business?",
          a: "If clients call you, message you or book with you — yes. We've built systems for restaurants, clinics, law firms, salons and agencies. If you're a service business, we adapt.",
        },
        {
          q: "How long until I'm up and running?",
          a: "24 hours for Essential. 48 hours for Business and Business+. 72 hours for Premium. Not weeks. Not months.",
        },
        {
          q: "What happens after delivery?",
          a: "The system runs on its own. No action needed from your side. Premium plan includes 30 days of support and adjustments. All plans include a handover walkthrough.",
        },
        {
          q: "Can I see it working before I buy?",
          a: "Yes. Call or WhatsApp +44 7576 594092 right now. Our demo receptionist is live 24/7. That's exactly what we build for you.",
        },
      ],
    },
    contact: {
      heading: "Request a Demo",
      subheading: "Tell us your biggest reception headache. We'll show you exactly what we can automate.",
      whatsapp: "Chat with us on WhatsApp",
      responseTime: "Response within 24 hours",
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
      founderBio: "I personally support every client through the setup of their intelligent reception system.",
    },
    footer: {
      tagline: "Smart reception systems, WhatsApp automation and operational dashboards for service businesses.",
      rights: "All rights reserved.",
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
    nav: { offer: "Notre offre", services: "Services", pricing: "Tarifs", demo: "Démo", process: "Méthode", contact: "Contact", cta: "Demander une démo" },
    hero: {
      badge: "Réception intelligente et automatisation pour entreprises de services",
      titleLine1: "Ne manquez plus",
      titleLine2: "jamais un client.",
      titleLine3: "24/7.",
      subtitle: "Réception intelligente et automatisation pour entreprises de services — appels, WhatsApp et rendez-vous gérés 24h/24.",
      ctaPrimary: "Demander une démo",
      ctaSecondary: "Voir les offres",
      bullets: ["Zéro appel manqué", "Automatisation WhatsApp", "Mise en place rapide - 24-72h"],
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
        { title: "Tableaux de bord opérationnels", desc: "Suivez les demandes, les équipes et l'activité quotidienne depuis une interface claire." },
        { title: "Assistant client IA", desc: "Une IA conversationnelle qui guide vos visiteurs, qualifie les demandes et répond immédiatement." },
        { title: "Flux d'automatisation sur mesure", desc: "Connectez vos outils, automatisez les tâches répétitives et gardez votre activité fluide pendant que vous vous concentrez sur l'essentiel." },
      ],
    },
    whoWeServe: {
      heading: "Quand quelqu'un a besoin de vous en urgence, décroche-t-il, ou appelle-t-il le suivant sur la liste ?",
      subheading: "Chaque appel sans réponse est un client perdu que vous ne verrez jamais. Serruriers, plombiers, vétérinaires d'urgence, professionnels de santé, et bien d'autres. Si votre métier ne tolère pas un appel manqué, ByCo Systems veille à ce que chaque demande reçoive une réponse, 24h/24.",
    },
    smartIntakeIntro: {
      heading: "Votre réceptionniste intelligent, 24h/24",
      subheading: "Capture, qualifie et redirige chaque demande client automatiquement - par téléphone, WhatsApp ou formulaire web.",
      benefits: ["Prise en charge client 24h/24", "Qualification des demandes", "Coordination plus rapide des réponses"],
      cta: "Demander une démo de l'accueil IA",
      note: "Démo privée du workflow disponible sur demande.",
      chatOnline: "Accueil intelligent · En ligne",
      chatGreeting: "Bonjour ! Comment pouvons-nous vous aider aujourd'hui ?",
      chatUserMsg: "J'ai besoin d'un devis pour un rendez-vous la semaine prochaine.",
      chatFollowup: "Très bien. Pouvez-vous partager votre nom, vos coordonnées et le jour souhaité ?",
      chatQualified: "Demande qualifiée",
      chatRouted: "Transmise à l'équipe",
      chatType: "Type",
      chatTypeValue: "Devis service",
      chatPriority: "Priorité",
      chatPriorityValue: "Standard",
    },
    smartIntakeDemo: {
      heading: "Découvrez comment un accueil intelligent 24h/24 traite de vraies demandes clients",
      subheading: "Cet exemple montre comment une entreprise peut recevoir, guider et qualifier automatiquement les demandes clients avant toute intervention humaine.",
      benefits: [
        { title: "Disponibilité 24h/24", desc: "Votre prise en charge ne s'arrête jamais. Captez de l'activité pendant votre repos, sans personnel supplémentaire." },
        { title: "Synchronisation multi-canal", desc: "Intégrez WhatsApp, email et votre site web dans un tableau de bord intelligent centralisé." },
        { title: "Qualification intelligente", desc: "L'IA note et catégorise automatiquement les demandes selon l'urgence, la priorité et la pertinence commerciale." },
        { title: "Assistant IA de prise en charge", desc: "Une IA conversationnelle qui capture les détails de la demande et répond immédiatement au client." },
        { title: "Analyses unifiées", desc: "Obtenez des indicateurs en temps réel sur le volume de demandes, la qualité des prospects et la conversion." },
        { title: "Sécurité renforcée", desc: "Le chiffrement des données garantit que les informations de vos clients restent toujours protégées et conformes." },
      ],
      steps: [
        { n: "01", title: "Capture", desc: "L'IA collecte les demandes depuis WhatsApp, le téléphone ou votre site web instantanément." },
        { n: "02", title: "Traitement", desc: "L'IA avancée extrait l'intention, l'urgence et la priorité en quelques millisecondes." },
        { n: "03", title: "Organisation", desc: "La demande est assignée à la bonne équipe avec un résumé IA clair." },
      ],
      cta: "Demander un système similaire",
      note: "Vidéo de démonstration en français - exemple adaptable aux cliniques, salons, agences et toute entreprise de services.",
    },
    featuredDemo: {
      liveHeading: "Système en direct — conçu pour un vrai restaurant",
      liveSubtext: "Ceci est une vraie démo que nous avons construite. Explorez-la, puis appelez ou contactez notre réceptionniste de démo sur WhatsApp.",
      exploreDemoCta: "Explorer la démo",
      whatsappCta: "Appeler ou WhatsApp +44 7576 594092",
      liveNote: "Notre réceptionniste de démo répond 24h/24. C'est exactement ce que nous construisons pour votre entreprise.",
      heading: "Votre tableau de bord opérationnel gratuit - inclus dès l'offre Business",
      subheading: "Suivez les demandes clients, assignez des tâches à votre équipe et surveillez votre activité en temps réel. Simple, clair, prêt dès le premier jour.",
      features: ["Suivi des tâches", "Gestion des unités", "Organisation des flux", "Coordination d'équipe", "Visibilité opérationnelle", "Gestion des demandes"],
      cta: "Explorer l'espace de travail",
    },
    pricing: {
      heading: "Des tarifs simples et transparents",
      subheading: "Paiement unique. Aucun abonnement. Sans surprise.",
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
            "Mise en place en 24h",
          ],
          cta: "Demander cette offre",
          badge: null,
        },
        {
          name: "Business",
          price: "990€",
          subtitle: "Un assistant infatigable, derrière le WhatsApp que vous avez déjà",
          desc: "WhatsApp est déjà sur votre téléphone, jour et nuit - mais vous aussi, et vous ne pouvez pas toujours répondre. Business installe un assistant intelligent derrière ce même numéro, qui répond instantanément, pose les bonnes questions, et prend le rendez-vous pendant que vous dormez, mangez, ou êtes déjà sur un chantier. Chaque message traité est un client qui n'est pas allé voir ailleurs.",
          features: [
            "Tout Essential",
            "Un assistant IA sur WhatsApp - répond et qualifie chaque message, 24h/24",
            "Redirection automatique - rien ne reste sans réponse",
            "🎁 ReadyFlow Manager inclus - chaque conversation enregistrée automatiquement, vous savez toujours qui relancer",
            "Mise en place en 48h",
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
            "Mise en place en 48-72h",
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
            "Mise en place en 72h",
          ],
          cta: "Demander cette offre",
          badge: null,
        },
      ],
      footerNote: "Besoin d'un système sur mesure ?",
      footerLinkText: "Parlez-nous - nous nous adaptons à toute entreprise de services.",
    },
    process: {
      heading: "Comment les projets passent de l'idée à un système utilisable",
      steps: [
        { n: "01", title: "Comprendre le workflow", desc: "Nous cartographions comment votre équipe travaille réellement aujourd'hui.", day: "Jour 1" },
        { n: "02", title: "Construire une première version pratique", desc: "Un système ciblé et utilisable - pas une plateforme surdimensionnée.", day: "Jour 1-2" },
        { n: "03", title: "Adapter le système à l'activité", desc: "Nous affinons les détails selon l'usage réel au quotidien.", day: "Jour 2-3" },
        { n: "04", title: "Livrer un outil opérationnel clair et utilisable", desc: "Un système sur lequel votre équipe peut compter dès le premier jour.", day: "Livré en 24-72h" },
      ],
    },
    faq: {
      heading: "Questions fréquentes",
      tagline: "Des réponses directes — sans blabla.",
      items: [
        {
          q: "Pourquoi pas un outil à 49€/mois ?",
          a: "Ces outils demandent installation, maintenance et frais récurrents. Nous le construisons, le configurons et vous le livrons. Un seul paiement. Fonctionne indéfiniment. Un seul client récupéré un samedi soir rembourse l'investissement.",
        },
        {
          q: "Est-ce adapté à mon type d'activité ?",
          a: "Si des clients vous appellent, vous écrivent ou réservent chez vous — oui. Nous avons construit des systèmes pour des restaurants, cliniques, cabinets juridiques, salons et agences. Si vous êtes une entreprise de services, nous nous adaptons.",
        },
        {
          q: "Combien de temps avant d'être opérationnel ?",
          a: "24h pour Essential. 48h pour Business et Business+. 72h pour Premium. Pas des semaines. Pas des mois.",
        },
        {
          q: "Que se passe-t-il après la livraison ?",
          a: "Le système fonctionne seul. Aucune action requise de votre part. L'offre Premium inclut 30 jours de support et d'ajustements. Toutes les offres incluent une prise en main guidée.",
        },
        {
          q: "Puis-je le voir fonctionner avant d'acheter ?",
          a: "Oui. Appelez ou contactez le +44 7576 594092 sur WhatsApp dès maintenant. Notre réceptionniste de démo est active 24h/24. C'est exactement ce que nous construisons pour vous.",
        },
      ],
    },
    contact: {
      heading: "Demander une démo",
      subheading: "Parlez-nous de votre plus gros casse-tête d'accueil. Nous vous montrerons exactement ce que nous pouvons automatiser.",
      whatsapp: "Discuter sur WhatsApp",
      responseTime: "Réponse sous 24 heures",
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
      founderBio: "J'accompagne personnellement chaque client dans la mise en place de son système d'accueil intelligent.",
    },
    footer: {
      tagline: "Systèmes de réception intelligente, automatisation WhatsApp et tableaux de bord opérationnels pour entreprises de services.",
      rights: "Tous droits réservés.",
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
