import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * vite.config.js — Vite bundler configuration.
 *
 * WHAT: Configures Vite for React development and production builds.
 * HOW:  Uses @vitejs/plugin-react for JSX transform + Fast Refresh.
 *       Proxy /api/* to the local backend during development so the
 *       frontend never needs to hard-code the backend origin.
 * WHY:  Proxy avoids CORS issues in dev; same domain in production.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
