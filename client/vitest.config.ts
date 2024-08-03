import { defineConfig } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitestTestSetup.js", // Optional, for additional setup
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
