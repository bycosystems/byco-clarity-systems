exports.handler = function (context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();

  const dial = twiml.dial({
    timeout: 20,
    callerId: context.ORLANE_NUMBER || '+447576594092',
  });
  dial.client(context.VOICE_CLIENT_IDENTITY);

  twiml.say(
    { language: 'fr-FR' },
    "Merci. Un responsable ByCo Systems vous recontactera très prochainement."
  );

  callback(null, twiml);
};
