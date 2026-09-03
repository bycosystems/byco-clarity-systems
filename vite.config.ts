import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

// Config standard, sans le wrapper @lovable.dev/vite-tanstack-config qui
// ne fonctionne correctement que dans le bac à sable cloud de Lovable
// (hors de ce contexte, il saute le plugin Nitro/Cloudflare et le dev
// server local ne sert plus aucune route — "Cannot GET /..." sur tout).
// Ce fichier reprend la même composition de plugins que le wrapper
// utilisait déjà en interne, sans les bouts spécifiques à l'éditeur
// visuel Lovable (hmrGate, componentTagger, dev-server-bridge).

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const define: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    define[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define,
    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    server: {
      host: "::",
      port: 8080,
      watch: {
        awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 },
      },
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
      }),
      nitro({
        preset: process.env.NITRO_PRESET ?? "cloudflare-module",
        output: {
          dir: "dist",
          serverDir: "dist/server",
          publicDir: "dist/client",
        },
        cloudflare: { nodeCompat: true, deployConfig: true },
      }),
      react(),
    ],
  };
});
