import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { releaseManifestSource } from "./server/release";

function releaseManifest(): Plugin {
  return {
    name: "release-manifest",
    apply: "build",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "release.json",
        source: releaseManifestSource(process.env.CF_PAGES_COMMIT_SHA),
      });
    },
  };
}

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    tailwindcss(),
    react(),
    releaseManifest(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    watch: {
      // O Playwright regrava estas pastas durante a suíte; observá-las causa EBUSY no Windows.
      ignored: ["**/playwright-report/**", "**/test-results/**"],
    },
  },
  build: {
    outDir: "dist/client",
  },
});
