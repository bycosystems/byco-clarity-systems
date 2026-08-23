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
  twiml.say(
    { language: 'en-US' },
    "Thank you. A ByCo Systems manager will contact you back very soon."
  );

  callback(null, twiml);
};
