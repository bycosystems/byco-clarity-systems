# Pont d'appel Orlane (caller ID masqué)

Objectif : Samuel déclenche depuis son téléphone un appel vers un prospect qui
voit s'afficher +44 7576 594092 (le numéro Orlane) au lieu de son numéro
personnel. Tout se passe dans Twilio (Studio + Functions) — aucune dépendance
à Make.

Compte Twilio : voir `.env` (Account SID).

**URL de production (stable, sans suffixe `-dev`)** — c'est celle-ci que
Samuel épingle sur son écran d'accueil Android :
`https://orlane-twilio-bridge-4765.twil.io/call-page.html`

## Principe

1. La page mobile de Samuel (Android, ajoutée à l'écran d'accueil) envoie une
   requête POST à une Twilio Function.
2. La Function vérifie un secret léger propre à ce endpoint, puis déclenche
   une exécution du Studio Flow.
3. Le Flow appelle d'abord Samuel — **en WebRTC par défaut** (directement dans
   la page, via le Twilio Voice SDK), avec un mode PSTN classique en secours.
   Quand Samuel décroche, le Flow compose le prospect en affichant
   +44 7576 594092 comme Caller ID.

Une fois déployée, la Function s'exécute avec les identifiants du compte via
`context.getTwilioClient()` — rien à saisir dans le code pour ça.

Pour le déploiement lui-même (fait par Claude Code via le CLI Twilio, à la
demande de Samuel), un identifiant d'API est nécessaire localement dans
`.env` (jamais commité, jamais affiché) — voir "Déploiement" ci-dessous.
Utilisez de préférence une **API Key restreinte** plutôt que l'Auth Token
principal du compte (scope Voice + Studio suffit).

## Réception du 1er leg : WebRTC au lieu du PSTN

Historiquement, le premier leg (Twilio → Samuel) était un appel PSTN classique
vers son numéro camerounais. Deux problèmes structurels en découlaient :
surcoût de terminaison PSTN vers le Cameroun sur *chaque* déclenchement, et
un Caller ID parfois altéré par l'opérateur camerounais à la réception (un
numéro libérien constaté au lieu du +44 attendu).

Le premier leg sonne maintenant **dans le navigateur de Samuel** (Twilio Voice
SDK, `call-page.html`), sans passer par aucun réseau télécom camerounais :
coût quasi nul, et aucun intermédiaire capable d'altérer l'identité affichée
puisqu'il n'y a plus de "réception téléphonique" à altérer.

### SDK auto-hébergé, pas de CDN

`call-page.html` charge `/vendor/twilio-voice-sdk.min.js` — un bundle
généré localement (`npm run build:voice-sdk`, exécuté automatiquement au
début de `npm run deploy`) plutôt qu'importé depuis un CDN. Deux CDN testés
(`jsdelivr` avec `+esm`, et `esm.sh`) cassent tous les deux sur
`@twilio/voice-sdk` : leur conversion CJS→ESM automatique résout mal la
dépendance interne `loglevel`, et `new Twilio.Device(token)` plante avec
`Cannot read properties of undefined (reading 'ERROR')` — reproduit et
confirmé sur les deux CDN avant de passer à cette solution. Le bundle est
produit par `scripts/build-voice-sdk.js` (esbuild) à partir de
`scripts/voice-sdk-entry.js`, qui expose `window.Twilio.Device`. Si le SDK
est mis à jour (`@twilio/voice-sdk` dans `devDependencies`), relancer
`npm run build:voice-sdk` (ou simplement `npm run deploy`, qui le fait déjà).

Le Studio Flow n'a **pas été modifié** : son widget "call_samuel" cible déjà
dynamiquement `{{contact.channel.address}}`, qui vaut la valeur `to` passée à
la création de l'exécution. `callback-bridge.js` passe désormais
`client:<VOICE_CLIENT_IDENTITY>` (ex. `client:samuel`) au lieu du numéro
E.164 de Samuel — Twilio route alors l'appel vers le Device WebRTC enregistré
sous cette identité (`call-page.html`, via `voice-token.js`) plutôt que vers
un téléphone.

**Compromis à connaître, pas à ignorer** : le WebRTC dépend d'une connexion
data/wifi active. Sur Android, une page en arrière-plan peut couper cette
connexion — contrairement à un appel PSTN qui continue même app fermée. Si le
réseau data est faible, **le mode PSTN classique reste plus fiable**. C'est
pour ça que :
- `call-page.html` affiche un indicateur en haut de la page (vert = WebRTC
  prêt, rouge = hors ligne) — à vérifier *avant* de déclencher un appel, pour
  ne pas découvrir un échec silencieux au moment critique ;
- un sélecteur "WebRTC (recommandé) / PSTN classique (secours)" permet de
  forcer le PSTN à la volée, sans rien redéployer, si la connexion est
  mauvaise dans une situation donnée ;
- si le mode WebRTC est actif mais que la connexion n'est *pas réellement*
  prête au moment où Samuel appuie sur "Appeler" (indicateur pas au vert), la
  page **bloque et demande une confirmation explicite** ("Connexion WebRTC
  non active — l'appel partira sur le réseau téléphonique classique.
  Continuer ?") avant de basculer sur PSTN — jamais de bascule automatique
  silencieuse. Le PSTN choisi *délibérément* via le sélecteur reste immédiat,
  sans cette confirmation.

Garder l'app/page ouverte au premier plan sur Android pendant les périodes où
des déclenchements sont attendus, pour éviter que le système ne coupe la
connexion WebRTC en arrière-plan.

### Nouvelles variables d'environnement

- `VOICE_CLIENT_IDENTITY` : identité du Client WebRTC de Samuel (ex.
  `samuel`). Doit être identique dans `callback-bridge.js` (qui l'utilise
  pour cibler `client:<identity>`) et `voice-token.js` (qui génère le token
  de cette identité).
- `TWILIO_API_KEY_SID` / `TWILIO_API_KEY_SECRET` : une API Key **Standard**
  (Console > Account > API keys & tokens > Create API key — pas de type
  "Restricted", ces clés-là ne peuvent pas signer d'Access Tokens). Sert
  uniquement à `voice-token.js` pour générer les Access Tokens du Voice SDK ;
  peut être distincte de l'API Key de déploiement.

Aucune TwiML Application n'est nécessaire : Samuel ne fait que *recevoir* des
appels dans le navigateur, jamais en émettre depuis celui-ci — le grant Voice
de l'Access Token est `incomingAllow: true` uniquement.

### Vérification recommandée avant usage réel

Le comportement "Studio route un appel sortant vers `client:<identity>`" suit
le comportement documenté de l'API Calls de Twilio (`To=client:<identity>`).
Côté HTTP, `voice-token` et `callback-bridge` ont été vérifiés sur le domaine
de production (`voice-token` renvoie un token avec les bons grants,
`callback-bridge` démarre bien une exécution Studio, `call-page.html` sert
bien la version avec la modale de confirmation PSTN) — mais la réception
WebRTC réelle (audio, micro, indicateur de connexion) n'a **pas** de test
automatisé possible depuis ce dépôt : il faut un navigateur avec le Device
réellement enregistré. Avant tout appel à un vrai prospect, c'est à Samuel de
confirmer, directement sur son téléphone :
1. Ouvrir `call-page.html` (URL de production ci-dessus), vérifier
   l'indicateur vert "Prêt à recevoir".
2. Lancer `npm run test-bridge` avec `TEST_MODE=webrtc` dans `.env` (numéro de
   test = le sien), et confirmer que l'appel arrive **dans la page**, pas
   comme un appel entrant classique.
3. Vérifier dans Console > Monitor > Logs > Calls que le coût du premier leg
   est proche de zéro (pas de tarif camerounais).

## Étape 1 — Studio Flow (déjà existant, déjà vérifié)

Le Flow existe déjà : SID dans `STUDIO_FLOW_SID` du `.env`.
Sa définition a été relue via l'API (`client.studio.v2.flows(...).fetch()`) —
inutile de la reconstruire, et les deux points suivants sont déjà confirmés :

1. **Nom du paramètre attendu par le second widget** ("connect_prospect",
   type Connect Call To) : `{{flow.data.to_prospect}}`, ce qui correspond bien
   à `FLOW_PARAM_NAME = 'to_prospect'` dans `callback-bridge.js`.
2. **Caller ID du second widget** : `{{flow.channel.address}}`, qui vaut
   `+447576594092` puisque le Flow est déclenché avec `from` =
   `TWILIO_NUMBER`. Confirmé correct.
3. **Premier widget ("call_samuel")** : cible `{{contact.channel.address}}`,
   c'est-à-dire la valeur `to` passée à la création de l'exécution — c'est ce
   qui permet à `callback-bridge.js` de rediriger ce leg vers
   `client:<VOICE_CLIENT_IDENTITY>` (WebRTC) ou `SAMUEL_NUMBER` (PSTN) sans
   toucher au Flow lui-même.

## Structure du projet

```
functions/callback-bridge.js       -> deployee en /callback-bridge (declenche le pont)
functions/voice-token.js           -> deployee en /voice-token (Access Token Voice SDK)
assets/call-page.html              -> deployee en /call-page.html
assets/vendor/twilio-voice-sdk.min.js -> deployee en /vendor/... (genere, voir ci-dessous)
scripts/voice-sdk-entry.js         -> point d'entree du bundle Voice SDK
scripts/build-voice-sdk.js         -> genere assets/vendor/twilio-voice-sdk.min.js (esbuild)
scripts/test-bridge.js             -> test interne (own numbers only)
.env.example                       -> a copier en .env, jamais commite
```

## Déploiement

1. `npm install`
2. Copiez `.env.example` en `.env` et remplissez :
   - `API_KEY_SID` / `API_KEY_SECRET` (recommandé, scope Voice + Studio) ou
     `AUTH_TOKEN` (Auth Token principal, à défaut),
   - `CALLBACK_SHARED_SECRET` (générez une chaîne aléatoire longue),
   - `STUDIO_FLOW_SID`, `SAMUEL_NUMBER`, `TWILIO_NUMBER` : à renseigner avec vos valeurs.
   - `VOICE_CLIENT_IDENTITY` : identité WebRTC (ex. `samuel`).
   - `TWILIO_API_KEY_SID` / `TWILIO_API_KEY_SECRET` : API Key **Standard**
     dédiée à la génération d'Access Tokens (voir section WebRTC ci-dessus).
   - `TEST_PROSPECT_NUMBER` : laissez égal à `SAMUEL_NUMBER` pour un test
     moi-vers-moi, ou mettez un second numéro qui vous appartient.
3. `npm run deploy` — déploie la Function et la page comme Assets/
   Environment Variables du Service. Notez l'URL de la Function affichée en
   sortie (ex. `https://orlane-tools-xxxx.twil.io/callback-bridge`), et
   collez-la dans `FUNCTION_URL` du `.env`.
4. Éditez `assets/call-page.html` : remplacez `SECRET` par la valeur de
   `CALLBACK_SHARED_SECRET`, et `FUNCTION_URL` par l'URL notée à l'étape 3 si
   elle n'est pas sur le même domaine. Re-déployez (`npm run deploy`).
   (`node scripts/inject-secret.js` fait ce remplacement automatiquement si
   le placeholder `REMPLACE_MOI` est encore présent.)
5. Sur Android, ouvrez l'URL de `call-page.html` dans Chrome → menu ⋮ →
   **Ajouter à l'écran d'accueil**. Au premier chargement, Chrome demandera
   l'autorisation d'utiliser le micro — l'accepter (nécessaire pour décrocher
   un appel WebRTC ; sans elle, l'indicateur restera hors ligne).

## Test interne (own numbers only)

Une fois déployé et `FUNCTION_URL`/`CALLBACK_SHARED_SECRET` renseignés dans
`.env` : `npm run test-bridge`.

Ce script POST vers la Function déployée exactement comme le ferait la page
mobile, avec `TEST_PROSPECT_NUMBER` du `.env` — jamais un numéro de prospect
réel. Laissez `TEST_PROSPECT_NUMBER` égal à `SAMUEL_NUMBER` pour un test
moi-vers-moi si vous n'avez pas de second numéro sous la main.

Par défaut `TEST_MODE=pstn` (le script n'a pas de navigateur pour recevoir un
appel WebRTC). Pour tester le premier leg en WebRTC, ouvrez `call-page.html`
sur votre téléphone (indicateur vert requis), passez `TEST_MODE=webrtc` dans
`.env`, puis relancez `npm run test-bridge`.

Si le test échoue (compte suspendu / permission refusée / autre) : le
script s'arrête et affiche l'erreur ; consultez aussi Console → Studio →
Executions → (l'exécution concernée) → Execution Steps pour le détail
exact. Ne pas réessayer en boucle.

Après un test réussi, confirmez que le Caller ID affiché sur le second appel
est bien `+44 7576 594092` avant tout appel à un vrai prospect.
