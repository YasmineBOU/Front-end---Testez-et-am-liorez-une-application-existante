describe('Admin Panel Page', () => {
  const users = require('../fixtures/users.json');

  beforeEach(() => {
    cy.login('admin');
    cy.visit('/admin-pannel');
  });

  describe('UI Elements', () => {

    it('should display all the required UI elements', () => {
      // Main title of the form
      cy.contains('h1', `Hi ${users.validAdminUser.login} 👋`).should('be.visible');
      cy.contains('h1', 'Admin Panel').should('be.visible');
      cy.contains('p', 'Manage users and system settings').should('be.visible'); 
      // Form Buttons
      cy.contains('button', 'List Users').should('be.visible');
      cy.contains('button', 'Create User').should('be.visible');
      cy.contains('button', 'Update User').should('be.visible');
      cy.contains('button', 'Delete User').should('be.visible');
    });
  });

  describe('Navigation', () => {
    it('should navigate to the list users page', () => {
      cy.contains('button', 'List Users').click();
      cy.url().should('include', '/crud/list-user');
    });

    it('should navigate to the create user page', () => {
      cy.contains('button', 'Create User').click();
      cy.url().should('include', '/crud/create-user');
    });

    it('should navigate to the update user page', () => {
      cy.contains('button', 'Update User').click();
      cy.url().should('include', '/crud/list-user');
    });

    it('should navigate to the delete user page', () => {
      cy.contains('button', 'Delete User').click();
      cy.url().should('include', '/crud/list-user');
    });
  });

});

