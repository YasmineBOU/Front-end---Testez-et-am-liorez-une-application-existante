import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    async setupNodeEvents(
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions
    ): Promise<Cypress.PluginConfigOptions> {
      // Appelle le plugin de couverture de code UNE SEULE FOIS
      require("@cypress/code-coverage/task")(on, config);

      return config;
    },
  },
});
