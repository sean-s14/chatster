import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

if (!process.env.VITE_SSL_KEY_FILE || !process.env.VITE_SSL_CRT_FILE) {
  throw new Error("SSL keys are not defined");
}

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
    proxy: {
      "/api": {
        target: process.env.VITE_SERVER_BASE_URL,
        changeOrigin: true,
        secure: process.env.NODE_ENV === "production",
      },
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
