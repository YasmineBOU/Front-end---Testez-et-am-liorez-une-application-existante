/// <reference types="cypress" />

const users = require('../fixtures/users.json');
const localStorageFixture = require('../fixtures/localStorage.json');

/**
 * Generate a JWT-like token valid for authentication
 * @param roles Array of roles (e.g., ['ROLE_ADMIN'] or ['ROLE_USER'])
 * @returns JWT-like token string with header.payload.signature
 */
function createJwtToken(roles: string[]): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600; // 1 hour expiry
  const payload = btoa(
    JSON.stringify({
      sub: 'user',
      roles: roles,
      exp: exp,
    })
  );
  const signature = btoa('signature');
  return `${header}.${payload}.${signature}`;
}

/**
 * Custom login command that:
 * - Generates a valid JWT token matching app expectations
 * - Populates localStorage with token and user info
 * - Does NOT navigate (specs handle their own navigation)
 * 
 * Usage:
 *   cy.login()         // Login as regular user
 *   cy.login('admin')  // Login as admin
 * @example cy.login(); cy.visit('/book-references');
 */
Cypress.Commands.add('login', (userType = 'user') => {
  const isAdmin = userType === 'admin';
  const testUser = isAdmin ? users.validAdminUser : users.validRegularUser;

  // Generate a valid JWT token
  const token = createJwtToken(isAdmin ? ['ROLE_ADMIN'] : ['ROLE_USER']);

  // Populate localStorage with authentication
  cy.window().then((win) => {
    win.localStorage.setItem(localStorageFixture.tokenKey, token);
    win.localStorage.setItem(
      localStorageFixture.loggedInUserKey,
      testUser.login
    );
  });
});

