import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:4200",
    supportFile: "cypress/support/e2e.ts",
  },
  component: {
    specPattern: "cypress/component/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    supportFile: "cypress/support/component.ts",
  },
});
