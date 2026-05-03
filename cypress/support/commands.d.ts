/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login a user for e2e tests
       * @param userType 'admin' or 'user' (defaults to 'user')
       * @example cy.login()
       * @example cy.login('admin')
       */
      login(userType?: string): Chainable<void>;
    }
  }
}

export {};
