require('dotenv').config();
const twilio = require('twilio');

const FLOW_SID = 'FW59ea5d46edcd1f48dfde964e4595d53b';
const EXECUTION_SID = process.argv[2] || 'FNd88015244de4c766c3bf684240a690e2';

function buildClient() {
  const accountSid = process.env.ACCOUNT_SID;
  const apiKeySid = process.env.API_KEY_SID;
  const apiKeySecret = process.env.API_KEY_SECRET;
  const authToken = process.env.AUTH_TOKEN;

  if (apiKeySid && apiKeySecret) {
    return twilio(apiKeySid, apiKeySecret, { accountSid });
  }
  return twilio(accountSid, authToken);
}

async function main() {
  const client = buildClient();

  const execution = await client.studio.v2.flows(FLOW_SID).executions(EXECUTION_SID).fetch();
  console.log('Execution:', execution.sid, '| status:', execution.status, '| date:', execution.dateCreated);

  const ctx = await client.studio.v2.flows(FLOW_SID).executions(EXECUTION_SID).executionContext().fetch();
  console.log('\n--- Contexte complet (widgets) ---');
  console.log(JSON.stringify(ctx.context, null, 2));

  const steps = await client.studio.v2.flows(FLOW_SID).executions(EXECUTION_SID).steps.list();
  console.log('\n--- Execution Steps ---');
  for (const step of steps) {
    console.log(`\n[${step.name}] ${step.dateCreated}`);
    console.log('  transitioned:', step.transitionedFrom, '->', step.transitionedTo);
    console.log('  context:', JSON.stringify(step.context));
  }
}

main().catch((err) => {
  console.error('Erreur inspection execution:', err.message);
  if (err.moreInfo) console.error('Plus d\'infos:', err.moreInfo);
  process.exit(1);
});
