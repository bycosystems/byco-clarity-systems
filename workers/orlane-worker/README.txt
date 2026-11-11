orlane-worker : source du Worker Cloudflare "orlane-worker" (compte contact.byco@gmail.com).
Version v4 (11/11/2026) = v3 + récap d'appel avec le prospect (lien de démo). v3 = v2 + routes /demo/* (garde-fou des appels-tests).
SHA-256 de index.mjs : a30fefd20dc6146768aedc1d71d3b2169742bdbd0449678d2a41c644d7cf8146
Déploiement : MANUEL, par l'éditeur de code Cloudflare (coller le fichier entier). Le build du site ne déploie pas ce dossier.
Liaison D1 : DB. Tables : interactions, demo_prospects, demo_events.
Secrets (jamais dans le dépôt) : ANTHROPIC_KEY, TWILIO_USER, TWILIO_PASS, RESEND_KEY, HOOK_KEY.
Variable texte : TWILIO_ACCOUNT_SID (identifiant du compte Twilio, retiré du code car GitHub bloque les identifiants Twilio).
Variable optionnelle : DEMO_CALLS_ENABLED = 0 coupe tous les appels-tests de la démo.
Cron (UTC) : 5 16 */2 * *
