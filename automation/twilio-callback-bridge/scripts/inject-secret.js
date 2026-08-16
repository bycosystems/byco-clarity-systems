require('dotenv').config();
const fs = require('fs');
const path = require('path');

const secret = process.env.CALLBACK_SHARED_SECRET;
if (!secret) {
  console.error('CALLBACK_SHARED_SECRET manquant dans .env');
  process.exit(1);
}

const pagePath = path.join(__dirname, '..', 'assets', 'call-page.html');
let html = fs.readFileSync(pagePath, 'utf8');

if (!html.includes("const SECRET = 'REMPLACE_MOI';")) {
  console.log('Rien a faire : le placeholder SECRET est deja remplace (ou introuvable).');
  process.exit(0);
}

html = html.replace("const SECRET = 'REMPLACE_MOI';", `const SECRET = ${JSON.stringify(secret)};`);
fs.writeFileSync(pagePath, html);
console.log('Secret injecte dans assets/call-page.html (valeur non affichee ici).');
