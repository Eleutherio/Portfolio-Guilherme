import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { parseClientEnvironment } from "./config/client-env";
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

export default defineConfig(({ mode }) => {
  const loadedEnvironment = loadEnv(mode, process.cwd(), "VITE_");
  parseClientEnvironment({
    VITE_API_URL: process.env.VITE_API_URL ?? loadedEnvironment.VITE_API_URL,
    VITE_RECAPTCHA_SITE_KEY:
      process.env.VITE_RECAPTCHA_SITE_KEY ?? loadedEnvironment.VITE_RECAPTCHA_SITE_KEY,
  });

  return {
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
      assetsInlineLimit: 0,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: "home-hero-runtime",
                test: /src[\\/]components[\\/]hero[\\/](?:CoffeeIcon|HeroCarouselContext|HeroStats|TerminalCard)\.tsx$/,
                includeDependenciesRecursively: false,
              },
              {
                name: "shared-content-ui",
                test: /src[\\/](?:components[\\/](?:TechnologyBadge\.tsx|sections[\\/]SectionShell\.tsx)|content[\\/]project-summaries\.ts|lib[\\/]contact-shared\.ts)$/,
                includeDependenciesRecursively: false,
              },
            ],
          },
        },
      },
    },
  };
});
