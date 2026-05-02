describe('Home Page', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  describe('UI Elements', () => {

    it('should display the main UI elements', () => {
      // Main title of the form
      cy.contains('h1', 'Student Library').should('be.visible');
      cy.contains('p', 'Manage your users efficiently with our admin panel').should('be.visible'); 
      // Buttons
      cy.contains('button', 'Register').should('be.visible');
      cy.contains('button', 'Login').should('be.visible');
    });
  });

  describe('Functionality', () => {

    it('should have a functional "Register" button', () => {
      cy.contains('button', 'Register').should('be.visible').click();
      cy.url().should('include', '/register');
    });

    it('should have a functional "Login" button', () => {
      cy.contains('button', 'Login').should('be.visible').click();
      cy.url().should('include', '/login');
    });
  });

});

