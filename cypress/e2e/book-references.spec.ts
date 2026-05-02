describe('Book References Page', () => {
  const bookReferences = require('../fixtures/book-references.json');

  beforeEach(() => {
    cy.login('user'); // Login as regular user (cached across specs)
    cy.visit('/book-references');
  });

  describe('UI Elements', () => {

    it('should display the main UI elements', () => {
      // Main title of the form
      cy.contains('h2', 'Book References').should('be.visible');
      cy.contains('p', 'Welcome. You can browse public book references on this page.').should('be.visible'); 
      // Buttons
      cy.contains('button', 'Back Home').should('be.visible');
    });
  });

  describe('Functionality', () => {
  
    it('should display the list of book references', () => {
      cy.get('.book-card').should('have.length', bookReferences.length);
    });

    it('should have a functional "Back Home" button', () => {
      cy.contains('button', 'Back Home').should('be.visible').click();
      cy.url().should('include', '/');
    });
  });

});

