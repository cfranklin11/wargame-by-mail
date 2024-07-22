import { defineConfig } from "cypress";

const { CYPRESS_BASE_URL = "http://localhost:7357" } = process.env;

export default defineConfig({
  e2e: {
    baseUrl: CYPRESS_BASE_URL,
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
