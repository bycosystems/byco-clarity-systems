require('dotenv').config();
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');

function run(cmd, args) {
  const result = spawnSync(cmd, args, { cwd: projectRoot, encoding: 'utf8' });
  if (result.error) throw result.error;
  return result;
}

// 1. Reconstruit assets/vendor/twilio-voice-sdk.min.js depuis
// scripts/voice-sdk-entry.js. Bundle auto-heberge (esbuild) plutot qu'un CDN
// a conversion CJS->ESM automatique : jsdelivr (+esm) ET esm.sh cassent tous
// les deux sur @twilio/voice-sdk (Logger interne mal resolu -> "Cannot read
// properties of undefined (reading 'ERROR')" a la construction du Device).
const buildSdk = run(process.execPath, [path.join(__dirname, 'build-voice-sdk.js')]);
process.stdout.write(buildSdk.stdout);
if (buildSdk.status !== 0) {
  process.stderr.write(buildSdk.stderr);
  process.exit(buildSdk.status || 1);
}

// 2. Injecte CALLBACK_SHARED_SECRET dans assets/call-page.html (remplace le
// placeholder REMPLACE_MOI s'il est encore present). Sans cette etape, la
// page deployee appelle voice-token/callback-bridge avec le mauvais secret
// et se prend un 403 en boucle.
const inject = run(process.execPath, [path.join(__dirname, 'inject-secret.js')]);
process.stdout.write(inject.stdout);
if (inject.status !== 0) {
  process.stderr.write(inject.stderr);
  process.exit(inject.status || 1);
}

// 3. Prepare .env.runtime (uniquement les vars destinees a la Function)
const split = run(process.execPath, [path.join(__dirname, 'split-env.js')]);
process.stdout.write(split.stdout);
if (split.status !== 0) {
  process.stderr.write(split.stderr);
  process.exit(split.status || 1);
}

// 4. Identifiants de deploiement : API Key de preference, sinon Auth Token
const username = process.env.API_KEY_SID || process.env.ACCOUNT_SID;
const password = process.env.API_KEY_SECRET || process.env.AUTH_TOKEN;

if (!username || !password) {
  console.error('Aucun identifiant de deploiement trouve (API_KEY_SID/API_KEY_SECRET ou ACCOUNT_SID/AUTH_TOKEN).');
  process.exit(1);
}

const twilioRunBin = path.join(projectRoot, 'node_modules', 'twilio-run', 'bin', 'twilio-run.js');

// Par defaut on deploie sur l'environnement "production" (domaine stable,
// sans suffixe -dev) : c'est l'outil de travail reel de Samuel, pas un
// prototype. Pour deployer sur "dev" a la place (tester une modification
// sans toucher a l'URL epinglee par Samuel) : DEPLOY_ENVIRONMENT=dev.
const targetEnv = process.env.DEPLOY_ENVIRONMENT || 'production';
const envArgs = targetEnv === 'production' ? ['--production'] : ['--environment', targetEnv];

console.log(`Deploiement en cours (environnement: ${targetEnv})...`);
const deploy = spawnSync(
  process.execPath,
  [
    twilioRunBin,
    'deploy',
    '--username', username,
    '--password', password,
    '--env', '.env.runtime',
    '--override-existing-project',
    ...envArgs,
  ],
  { cwd: projectRoot, encoding: 'utf8', shell: false }
);

if (deploy.error) {
  console.error('Erreur de lancement du processus twilio-run:', deploy.error.message);
  process.exit(1);
}

// Filet de securite : on n'affiche jamais un stdout/stderr qui contiendrait
// par accident le secret (peu probable, la CLI ne les echo pas, mais on
// verifie quand meme avant d'imprimer).
function redact(text) {
  let out = text;
  if (password) out = out.split(password).join('[REDACTED]');
  if (username) out = out.split(username).join('[REDACTED]');
  return out;
}

process.stdout.write(redact(deploy.stdout || ''));
process.stderr.write(redact(deploy.stderr || ''));

if (deploy.status !== 0) {
  console.error('\nEchec du deploiement (code ' + deploy.status + ').');
  process.exit(deploy.status || 1);
}

// 5. Extrait l'URL de la Function depuis la sortie et met a jour .env
const match = (deploy.stdout || '').match(/https:\/\/[^\s]+\/callback-bridge/);
if (match) {
  const functionUrl = match[0];
  const envPath = path.join(projectRoot, '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  if (/^FUNCTION_URL=.*$/m.test(envContent)) {
    envContent = envContent.replace(/^FUNCTION_URL=.*$/m, `FUNCTION_URL=${functionUrl}`);
  } else {
    envContent += `\nFUNCTION_URL=${functionUrl}\n`;
  }
  fs.writeFileSync(envPath, envContent);
  console.log('\nFUNCTION_URL mise a jour dans .env :', functionUrl);
} else {
  console.log('\nURL de la Function non detectee automatiquement - va la chercher dans la sortie ci-dessus et colle-la dans FUNCTION_URL du .env.');
}
