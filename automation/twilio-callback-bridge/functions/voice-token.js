'use strict';

// Twilio Function — genere un Access Token (Voice SDK) pour que la page de
// Samuel puisse s'enregistrer comme Client WebRTC ("VOICE_CLIENT_IDENTITY")
// et recevoir le premier leg du pont d'appel directement dans le navigateur
// (voir callback-bridge.js et le widget "call_samuel" du Studio Flow).
//
// Grant "incoming" uniquement : Samuel ne fait jamais d'appel sortant depuis
// le navigateur, seulement de la reception. Pas besoin de TwiML App.
//
// Variables d'environnement attendues (Console Twilio, jamais dans ce fichier
// ni dans le depot) :
//   TWILIO_API_KEY_SID     SID d'une API Key **Standard** (SKxxxx) — les cles
//                          Restricted ne peuvent pas generer d'Access Tokens
//   TWILIO_API_KEY_SECRET  Secret de cette API Key
//   VOICE_CLIENT_IDENTITY  Identite du Client WebRTC (ex. "samuel"), doit
//                          correspondre a celle utilisee dans callback-bridge.js
//   CALLBACK_SHARED_SECRET Meme secret que callback-bridge.js — empeche un
//                          tiers de generer un token pour ecouter les appels

const crypto = require('crypto');
const AccessToken = require('twilio').jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const TOKEN_TTL_SECONDS = 3600;

function secretMatches(provided, expected) {
  const a = Buffer.from(String(provided || ''));
  const b = Buffer.from(String(expected || ''));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

exports.handler = function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');

  if (!secretMatches(event.secret, context.CALLBACK_SHARED_SECRET)) {
    response.setStatusCode(403);
    response.setBody({ error: 'forbidden' });
    return callback(null, response);
  }

  const identity = context.VOICE_CLIENT_IDENTITY;
  if (!identity || !context.TWILIO_API_KEY_SID || !context.TWILIO_API_KEY_SECRET) {
    response.setStatusCode(500);
    response.setBody({ error: 'configuration incomplete (VOICE_CLIENT_IDENTITY / TWILIO_API_KEY_SID / TWILIO_API_KEY_SECRET)' });
    return callback(null, response);
  }

  try {
    const token = new AccessToken(
      context.ACCOUNT_SID,
      context.TWILIO_API_KEY_SID,
      context.TWILIO_API_KEY_SECRET,
      { identity, ttl: TOKEN_TTL_SECONDS }
    );
    token.addGrant(new VoiceGrant({ incomingAllow: true }));

    response.setStatusCode(200);
    response.setBody({ token: token.toJwt(), identity, ttl: TOKEN_TTL_SECONDS });
    return callback(null, response);
  } catch (err) {
    response.setStatusCode(502);
    response.setBody({ error: 'token_error' });
    return callback(null, response);
  }
};
