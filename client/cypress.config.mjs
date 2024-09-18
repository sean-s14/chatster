import { defineConfig } from "cypress";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  chromeWebSecurity: false,
  env: {
    VITE_AUTH0_DOMAIN: process.env.VITE_AUTH0_DOMAIN,
    AUTH_TEST_EMAIL: process.env.AUTH_TEST_EMAIL,
    AUTH_TEST_PASSWORD: process.env.AUTH_TEST_PASSWORD,
    VITE_BASE_URL: process.env.VITE_BASE_URL,
  },
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
  },
});
