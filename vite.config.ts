import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, "src/components"),
      utils: path.resolve(__dirname, "src/components/lib/utils"),
      ui: path.resolve(__dirname, "src/components/ui"),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
      output: {
        dir: "dist",
        format: "es",
      },
    },
    outDir: "dist",
    assetsDir: "assets",
    minify: false,
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ["src/**/*", "components/**/*", "utils/**/*", "ui/**/*"],
    exclude: ["node_modules"],
  },
});
