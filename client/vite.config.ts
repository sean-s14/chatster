import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    https: {
      key: process.env.VITE_SSL_KEY_FILE!,
      cert: process.env.VITE_SSL_CRT_FILE!,
    },
    port: 3000,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    https: {
      key: process.env.VITE_SSL_KEY_FILE!,
      cert: process.env.VITE_SSL_CRT_FILE!,
    },
    port: 3000,
  },
});
