'use strict';

// Twilio Function — Server URL Vapi pour le numero Orlane (+44 7576 594092).
//
// Remplace l'assistantId fixe precedemment configure sur le numero de
// telephone Vapi. Vapi n'appelle ce webhook ("assistant-request") que si le
// numero n'a AUCUN assistantId/squadId/workflowId fixe — voir la
// reconfiguration du phone-number correspondante.
//
// Pourquoi : sur un vrai appel entrant (PSTN, sans navigateur), il n'existe
// aucun cote client capable de calculer marche/price_* comme le fait
// useOrlaneCall.ts pour la demo web. Ce webhook joue ce role a la place :
// il lit l'indicatif du numero appelant et renvoie les memes 4 montants
// (memes valeurs, memes formats "lisibles a l'oral" que useOrlaneCall.ts)
// directement dans assistantOverrides.variableValues, pour que le prompt
// Orlane recoive TOUJOURS des tokens {{price_*}} peuples, quel que soit le
// canal (web ou telephone reel).
//
// Ne doit jamais planter ni renvoyer une erreur : un echec ici bloquerait un
// vrai appel client (contrairement a un bug de prix, une panne totale). En
// cas de doute (numero absent, secret invalide, etc.) on retombe sur
// "europe" plutot que de renvoyer une erreur qui casserait l'appel.
//
// Variables d'environnement attendues (deja definies pour ce service) :
//   CALLBACK_SHARED_SECRET  Meme secret que callback-bridge.js / voice-token.js
//                           - transmis en query string (?secret=...) sur le
//                           Server URL configure cote Vapi, verifie ci-dessous.

const crypto = require('crypto');

const ORLANE_ASSISTANT_ID = '621b0d76-7aad-483e-89b7-30c0b55415b7';

const AFRIQUE_FRANCOPHONE_PREFIXES = ['+237', '+221', '+225'];

// Indicatifs francophones connus, utilises uniquement pour choisir la langue
// de la phrase d'ouverture (firstMessage) - une liste plus large que
// AFRIQUE_FRANCOPHONE_PREFIXES ci-dessus, qui ne sert qu'a la grille de prix.
// Tout indicatif absent de cette liste (y compris non reconnu ou numero
// masque) demarre en anglais : c'est la langue la plus largement comprise en
// seconde langue, un repli par defaut plus sur que le francais.
const FRANCOPHONE_START_PREFIXES = [
  '+33', '+32', '+41', // France, Belgique, Suisse
  '+237', '+221', '+225', '+212', '+216', '+213', // Cameroun, Senegal, Cote d'Ivoire, Maroc, Tunisie, Algerie
  '+229', '+223', '+226', '+228', '+241', '+242', '+243', // Benin, Mali, Burkina Faso, Togo, Gabon, Congo-Brazzaville, RDC
];

const FIRST_MESSAGE_FR_FIRST = 'Bonjour, ByCo Systems, Orlane à votre écoute. Hello, ByCo Systems, Orlane speaking.';
const FIRST_MESSAGE_EN_FIRST = 'Hello, ByCo Systems, Orlane speaking. Bonjour, ByCo Systems, Orlane à votre écoute.';

function secretMatches(provided, expected) {
  const a = Buffer.from(String(provided || ''));
  const b = Buffer.from(String(expected || ''));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function resolveMarche(number) {
  if (typeof number === 'string' && AFRIQUE_FRANCOPHONE_PREFIXES.some((p) => number.startsWith(p))) {
    return 'afrique_francophone';
  }
  return 'europe';
}

function resolveStartLanguage(number) {
  if (typeof number === 'string' && FRANCOPHONE_START_PREFIXES.some((p) => number.startsWith(p))) {
    return 'fr';
  }
  return 'en';
}

function firstMessageFor(lang) {
  return lang === 'fr' ? FIRST_MESSAGE_FR_FIRST : FIRST_MESSAGE_EN_FIRST;
}

// Memes valeurs, memes formats que src/lib/useOrlaneCall.ts sur
// byco-clarity-systems - a garder en sync. Montants en toutes lettres, un
// jeu par langue : aucun format numerique (avec ou sans separateur, virgule
// ou espace) ne se fait lire correctement par la synthese vocale - lecture
// chiffre par chiffre, ou virgule prise pour un separateur decimal. Orlane
// ne lit donc plus jamais un chiffre, le montant a reciter est deja ecrit
// comme texte.
function pricesFor(marche) {
  return marche === 'afrique_francophone'
    ? {
        essentialFr: 'trois cent quarante-trois mille neuf cents francs CFA',
        essentialEn: 'three hundred forty-three thousand nine hundred CFA francs',
        essentialDigits: '343 900 FCFA',
        businessFr: 'six cent quatre-vingt-quatorze mille neuf cents francs CFA',
        businessEn: 'six hundred ninety-four thousand nine hundred CFA francs',
        businessDigits: '694 900 FCFA',
        businessPlusFr: 'un million quarante-cinq mille huit cents francs CFA',
        businessPlusEn: 'one million forty-five thousand eight hundred CFA francs',
        businessPlusDigits: '1 045 800 FCFA',
        premiumFr: 'un million trois cent quatre-vingt-seize mille sept cents francs CFA',
        premiumEn: 'one million three hundred ninety-six thousand seven hundred CFA francs',
        premiumDigits: '1 396 700 FCFA',
      }
    : {
        essentialFr: 'quatre cent quatre-vingt-dix euros',
        essentialEn: 'four hundred ninety euros',
        essentialDigits: '490 €',
        businessFr: 'neuf cent quatre-vingt-dix euros',
        businessEn: 'nine hundred ninety euros',
        businessDigits: '990 €',
        businessPlusFr: 'mille quatre cent quatre-vingt-dix euros',
        businessPlusEn: 'one thousand four hundred ninety euros',
        businessPlusDigits: '1 490 €',
        premiumFr: 'mille neuf cent quatre-vingt-dix euros',
        premiumEn: 'one thousand nine hundred ninety euros',
        premiumDigits: '1 990 €',
      };
}

exports.handler = function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');

  if (!secretMatches(event.secret, context.CALLBACK_SHARED_SECRET)) {
    response.setStatusCode(403);
    response.setBody({ error: 'forbidden' });
    return callback(null, response);
  }

  // Tout ce qui suit est protege par un filet de securite : un numero
  // absent, masque ("anonymous", "restricted"...), ou dans un format
  // imprevu ne doit jamais faire echouer la reponse au webhook — ca
  // bloquerait un vrai appel client. En cas de doute (y compris une
  // exception totalement imprevue ici), on repond quand meme 200 avec
  // l'assistant et les montants "europe" par defaut.
  try {
    let number;
    try {
      const message = event.message || {};
      number = (message.customer && message.customer.number) || (message.call && message.call.customer && message.call.customer.number);
    } catch (e) {
      number = undefined;
    }

    const marche = resolveMarche(number);
    const prices = pricesFor(marche);
    const lang = resolveStartLanguage(number);

    response.setStatusCode(200);
    response.setBody({
      assistantId: ORLANE_ASSISTANT_ID,
      assistantOverrides: {
        firstMessage: firstMessageFor(lang),
        variableValues: {
          marche,
          price_essential_fr: prices.essentialFr,
          price_essential_en: prices.essentialEn,
          price_essential_digits: prices.essentialDigits,
          price_business_fr: prices.businessFr,
          price_business_en: prices.businessEn,
          price_business_digits: prices.businessDigits,
          price_business_plus_fr: prices.businessPlusFr,
          price_business_plus_en: prices.businessPlusEn,
          price_business_plus_digits: prices.businessPlusDigits,
          price_premium_fr: prices.premiumFr,
          price_premium_en: prices.premiumEn,
          price_premium_digits: prices.premiumDigits,
        },
      },
    });
    return callback(null, response);
  } catch (e) {
    const prices = pricesFor('europe');
    response.setStatusCode(200);
    response.setBody({
      assistantId: ORLANE_ASSISTANT_ID,
      assistantOverrides: {
        firstMessage: firstMessageFor('en'),
        variableValues: {
          marche: 'europe',
          price_essential_fr: prices.essentialFr,
          price_essential_en: prices.essentialEn,
          price_essential_digits: prices.essentialDigits,
          price_business_fr: prices.businessFr,
          price_business_en: prices.businessEn,
          price_business_digits: prices.businessDigits,
          price_business_plus_fr: prices.businessPlusFr,
          price_business_plus_en: prices.businessPlusEn,
          price_business_plus_digits: prices.businessPlusDigits,
          price_premium_fr: prices.premiumFr,
          price_premium_en: prices.premiumEn,
          price_premium_digits: prices.premiumDigits,
        },
      },
    });
    return callback(null, response);
  }
};
