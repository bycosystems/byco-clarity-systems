'use strict';

// Twilio Function — proxy sécurisé pour déclencher le pont d'appel Orlane.
// Déployée dans Twilio Functions & Assets (aucune dépendance à Make).
//
// Le premier leg (Twilio -> Samuel) peut être reçu de deux façons :
//   - "webrtc" (par défaut) : sonne dans le navigateur de Samuel via le
//     Twilio Voice SDK (Client identity VOICE_CLIENT_IDENTITY). Coût quasi
//     nul, pas d'intermédiaire télécom capable d'altérer le Caller ID.
//   - "pstn" (secours) : appel classique vers SAMUEL_NUMBER, utile si la
//     connexion data/wifi de Samuel est trop faible pour du WebRTC fiable.
// Le Studio Flow n'a besoin d'aucune modification : son widget "call_samuel"
// cible déjà dynamiquement {{contact.channel.address}}, qui vaut ici la
// valeur "to" passée à la création de l'exécution ci-dessous.
//
// Variables d'environnement attendues (à définir dans la Console Twilio,
// jamais dans ce fichier ni dans le dépôt) :
//   STUDIO_FLOW_SID        SID du Studio Flow "orlane-callback-bridge"
//   SAMUEL_NUMBER          Numéro mobile de Samuel, format E.164 (secours PSTN)
//   TWILIO_NUMBER          +447576594092 (numéro Orlane)
//   VOICE_CLIENT_IDENTITY  Identité du Client WebRTC de Samuel (ex. "samuel"),
//                          doit correspondre à celle utilisée dans voice-token.js
//   CALLBACK_SHARED_SECRET Secret léger propre à ce endpoint (généré par Samuel,
//                          distinct de l'Auth Token du compte)

const crypto = require('crypto');

const E164 = /^\+[1-9]\d{6,14}$/;

function secretMatches(provided, expected) {
  const a = Buffer.from(String(provided || ''));
  const b = Buffer.from(String(expected || ''));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');

  if (!secretMatches(event.secret, context.CALLBACK_SHARED_SECRET)) {
    response.setStatusCode(403);
    response.setBody({ error: 'forbidden' });
    return callback(null, response);
  }

  const to = event.to;
  if (!to || !E164.test(to)) {
    response.setStatusCode(400);
    response.setBody({ error: 'numero "to" invalide, format E.164 attendu (+33...)' });
    return callback(null, response);
  }

  const rawMode = String(event.mode || 'webrtc').toLowerCase();
  const mode = rawMode === 'pstn' ? 'pstn' : 'webrtc';

  let samuelTarget;
  if (mode === 'pstn') {
    samuelTarget = context.SAMUEL_NUMBER;
  } else {
    if (!context.VOICE_CLIENT_IDENTITY) {
      response.setStatusCode(500);
      response.setBody({ error: 'VOICE_CLIENT_IDENTITY non configuree' });
      return callback(null, response);
    }
    samuelTarget = `client:${context.VOICE_CLIENT_IDENTITY}`;
  }

  try {
    const client = context.getTwilioClient();
    // Correspond au widget "Connect Call To" du Flow, qui lit
    // {{flow.data.to_prospect}} (auto-rempli par Studio a partir de
    // "parameters" ci-dessous des la creation de l'execution).
    const FLOW_PARAM_NAME = 'to_prospect';

    const execution = await client.studio.v2
      .flows(context.STUDIO_FLOW_SID)
      .executions.create({
        to: samuelTarget,
        from: context.TWILIO_NUMBER,
        parameters: { [FLOW_PARAM_NAME]: to },
      });

    response.setStatusCode(200);
    response.setBody({ status: 'started', executionSid: execution.sid, mode });
    return callback(null, response);
  } catch (err) {
    response.setStatusCode(502);
    response.setBody({ error: 'twilio_error' });
    return callback(null, response);
  }
};
