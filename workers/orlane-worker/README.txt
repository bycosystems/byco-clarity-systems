orlane-worker : source du Worker Cloudflare "orlane-worker" (compte contact.byco@gmail.com).
Version v3 (11/11/2026) = v2 du 09/11 + routes /demo/* (garde-fou des appels-tests de la démo du site).
SHA-256 de index.mjs : 424ad4d8e7478481bf57929d3cb179a37d8a45bd06823b0f1ea27f17a78a4c86
Déploiement : MANUEL, par l'éditeur de code Cloudflare (coller le fichier entier). Le build du site ne déploie pas ce dossier.
Liaison D1 : DB. Tables : interactions, demo_prospects, demo_events.
Secrets (jamais dans le dépôt) : ANTHROPIC_KEY, TWILIO_USER, TWILIO_PASS, RESEND_KEY, HOOK_KEY.
Variable texte : TWILIO_ACCOUNT_SID (identifiant du compte Twilio, retiré du code car GitHub bloque les identifiants Twilio).
Variable optionnelle : DEMO_CALLS_ENABLED = 0 coupe tous les appels-tests de la démo.
Cron (UTC) : 5 16 */2 * *
