// Separe .env (identifiants de deploiement + config de test, jamais pousses
// vers Twilio) de .env.runtime (seules les 4 variables ci-dessous, qui
// deviennent les Environment Variables reelles de la Function deployee).
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const RUNTIME_KEYS = [
  'STUDIO_FLOW_SID',
  'SAMUEL_NUMBER',
  'TWILIO_NUMBER',
  'CALLBACK_SHARED_SECRET',
  'VOICE_CLIENT_IDENTITY',
  'TWILIO_API_KEY_SID',
  'TWILIO_API_KEY_SECRET',
];

const missing = RUNTIME_KEYS.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Variables manquantes dans .env:', missing.join(', '));
  process.exit(1);
}

const lines = RUNTIME_KEYS.map((k) => `${k}=${process.env[k]}`);
fs.writeFileSync(path.join(__dirname, '..', '.env.runtime'), lines.join('\n') + '\n');
console.log('.env.runtime ecrit (' + RUNTIME_KEYS.length + ' variables, valeurs non affichees ici).');
