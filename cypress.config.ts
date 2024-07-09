import { defineConfig } from "cypress";

const { BASE_URL = "http://localhost:5173" } = process.env;

export default defineConfig({
  e2e: {
    baseUrl: BASE_URL,
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
