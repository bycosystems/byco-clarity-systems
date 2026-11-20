orlane-worker : source du Worker Cloudflare "orlane-worker" (compte contact.byco@gmail.com).
Version v5 (20/11/2026) = v4 + mode démo (voix : champs secteur/activite/langue renvoyés par /demo/gate ; WhatsApp : démo rattachée au clic récent sur le bouton WhatsApp de la démo (table wa_click, fenêtre 1 h, un clic ne sert qu'une fois) ou au nom cité par le prospect, session 24 h dans la table wa_demo). Version v4 (11/11/2026) = v3 + récap d'appel avec le prospect (lien de démo). v3 = v2 + routes /demo/* (garde-fou des appels-tests).
SHA-256 de index.mjs : 0144a03afaead402071d65effb07e67df2d36be1cccff049c64c99eb51905ed8
Déploiement : MANUEL, par l'éditeur de code Cloudflare (coller le fichier entier). Le build du site ne déploie pas ce dossier.
Liaison D1 : DB. Tables : interactions, demo_prospects (colonnes secteur, activite, langue), demo_events, wa_demo, wa_click.
Secrets (jamais dans le dépôt) : ANTHROPIC_KEY, TWILIO_USER, TWILIO_PASS, RESEND_KEY, HOOK_KEY.
Variable texte : TWILIO_ACCOUNT_SID (identifiant du compte Twilio, retiré du code car GitHub bloque les identifiants Twilio).
Variable optionnelle : DEMO_CALLS_ENABLED = 0 coupe tous les appels-tests de la démo.
Cron (UTC) : 5 16 */2 * *
