// Point d'entree pour le bundle navigateur du Voice SDK. Bundle localement
// avec esbuild (voir scripts/build-voice-sdk.js) plutot que de dependre d'un
// CDN a conversion CJS->ESM automatique : jsdelivr (+esm) et esm.sh cassent
// tous les deux sur ce paquet (le Logger interne se resout vers `console` au
// lieu du vrai module `loglevel`, faisant planter `new Device()` avec
// "Cannot read properties of undefined (reading 'ERROR')").
import { Device } from '@twilio/voice-sdk';

window.Twilio = window.Twilio || {};
window.Twilio.Device = Device;
