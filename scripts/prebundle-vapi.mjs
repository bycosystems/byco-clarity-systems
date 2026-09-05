// Contourne le bug Rollup/Vite (vitejs/vite#9703 — "Inconsistency between
// dev & build") : en dev, Vite pré-bundle @vapi-ai/web via esbuild et le
// require("events") CJS interne résout correctement vers le polyfill browser
// d'esbuild. En build, Rollup traite ce même module CJS différemment et le
// require("events") externalisé résout vers un stub vide, d'où
// "Class extends value #<Object> is not a constructor or null" au runtime.
//
// Solution : pré-empaqueter @vapi-ai/web nous-mêmes avec l'API programmatique
// esbuild (le même bundler qui fonctionne correctement en dev) en un seul
// fichier ESM propre, puis importer ce fichier local au lieu du paquet — pour
// que Rollup ne voie plus jamais le CJS problématique.
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// On bundle un point d'entrée ESM synthétique (plutôt que dist/vapi.js
// directement) pour qu'esbuild applique l'interop CJS→ESM au bon endroit :
// bundler le fichier CJS en entrée directe ne fait qu'envelopper son
// `module.exports` brut (donc `export default { __esModule, default: Vapi }`,
// la classe restant piégée un niveau plus bas) — passer par un `import
// Vapi from "@vapi-ai/web"` classique laisse esbuild détecter le flag
// __esModule et dérouler `.default` lui-même, comme le ferait Node ou tout
// bundler ESM standard.
await build({
  stdin: {
    contents: `export { default } from "@vapi-ai/web";`,
    resolveDir: projectRoot,
    sourcefile: "vapi-entry.js",
    loader: "js",
  },
  outfile: path.join(projectRoot, "src/vendor/vapi-bundled.mjs"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2020",
  minify: false,
  sourcemap: false,
  logLevel: "info",
});

console.log("✓ @vapi-ai/web pré-empaqueté vers src/vendor/vapi-bundled.mjs");
