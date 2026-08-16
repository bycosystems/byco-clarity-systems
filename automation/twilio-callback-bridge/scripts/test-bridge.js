require('dotenv').config();

const REQUIRED = ['FUNCTION_URL', 'CALLBACK_SHARED_SECRET', 'TEST_PROSPECT_NUMBER'];

async function main() {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('Variables manquantes dans .env:', missing.join(', '));
    console.error('(FUNCTION_URL se remplit apres "npm run deploy")');
    process.exit(1);
  }

  const { FUNCTION_URL, CALLBACK_SHARED_SECRET, TEST_PROSPECT_NUMBER, SAMUEL_NUMBER } = process.env;
  const mode = (process.env.TEST_MODE || 'pstn').toLowerCase() === 'webrtc' ? 'webrtc' : 'pstn';

  console.log('--- Test interne du pont d\'appel ---');
  console.log('Mode premier leg:', mode, mode === 'webrtc' ? '(le navigateur de Samuel doit etre ouvert et enregistre sur call-page.html)' : '');
  console.log('Appel 1 (agent):', SAMUEL_NUMBER);
  console.log('Appel 2 (test "prospect"):', TEST_PROSPECT_NUMBER);
  if (TEST_PROSPECT_NUMBER === SAMUEL_NUMBER) {
    console.log('(Meme numero pour les deux jambes - test moi-vers-moi)');
  }
  console.log('Cible:', FUNCTION_URL);
  console.log('');

  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: TEST_PROSPECT_NUMBER, secret: CALLBACK_SHARED_SECRET, mode }),
  });

  const data = await res.json().catch(() => ({}));
  console.log('HTTP', res.status, JSON.stringify(data));

  if (res.ok && data.status === 'started') {
    console.log('\nExecution demarree:', data.executionSid);
    console.log('Decroche ton telephone dans les prochaines secondes.');
    console.log('Verifie le resultat dans Console > Studio > Executions,');
    console.log('et confirme que le Caller ID affiche sur le second appel est +44 7576 594092.');
  } else {
    console.error('\nEchec du declenchement. Ne pas reessayer en boucle.');
    console.error('Va voir Console > Studio > Executions > (execution concernee) > Execution Steps');
    console.error('pour le detail exact de l\'erreur.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Erreur script:', err.message);
  process.exit(1);
});
