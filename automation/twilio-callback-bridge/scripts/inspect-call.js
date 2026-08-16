require('dotenv').config();
const twilio = require('twilio');

const CALL_SID = process.argv[2];
if (!CALL_SID) {
  console.error('Usage: node scripts/inspect-call.js CAxxxxxxxx');
  process.exit(1);
}

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
  const call = await client.calls(CALL_SID).fetch();
  console.log(JSON.stringify({
    sid: call.sid,
    parentCallSid: call.parentCallSid,
    from: call.from,
    fromFormatted: call.fromFormatted,
    to: call.to,
    toFormatted: call.toFormatted,
    status: call.status,
    direction: call.direction,
    duration: call.duration,
    startTime: call.startTime,
    endTime: call.endTime,
  }, null, 2));
}

main().catch((err) => {
  console.error('Erreur inspection call:', err.message);
  process.exit(1);
});
