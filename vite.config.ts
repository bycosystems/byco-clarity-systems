import { defineConfig } from "@lovable.dev/vite-tanstack-config";
export default defineConfig({
  base: '/byco-clarity-systems/',
  tanstackStart: {
    server: { entry: "server" },
  },
});
