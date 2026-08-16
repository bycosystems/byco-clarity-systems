require('esbuild').buildSync({
  entryPoints: ['scripts/voice-sdk-entry.js'],
  bundle: true,
  minify: true,
  platform: 'browser',
  format: 'iife',
  outfile: 'assets/vendor/twilio-voice-sdk.min.js',
});
console.log('assets/vendor/twilio-voice-sdk.min.js reconstruit.');
