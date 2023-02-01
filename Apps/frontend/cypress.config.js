import { defineConfig } from "cypress";
import codeCoverage from "@cypress/code-coverage/task.js";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverage(on, config);
      return config;
    },
  },
});
