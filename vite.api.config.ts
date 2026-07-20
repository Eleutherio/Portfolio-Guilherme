import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    ssr: "server/index.ts",
    outDir: "dist-api",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "server.js",
      },
    },
  },
});
