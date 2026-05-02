describe('Register Page', () => {
  const users = require('../fixtures/users.json');

  beforeEach(() => {
    cy.visit('/register');
  });

  describe('UI Elements', () => {

    it('should display all the required UI elements', () => {
      // Main title of the form
      cy.contains('h2', 'Register Form').should('be.visible');
      // Back to Home button
      cy.get('.back-home-btn').should('be.visible');  
      // Form fields and their labels
      cy.contains('label', 'First Name').should('be.visible');
      cy.get('input[id="firstName"]').should('be.visible');

      cy.contains('label', 'Last Name').should('be.visible');
      cy.get('input[id="lastName"]').should('be.visible');
      
      cy.contains('label', 'Login').should('be.visible');
      cy.get('input[id="login"]').should('be.visible');
      
      cy.contains('label', 'Password').should('be.visible');
      cy.get('input[id="password"]').should('be.visible');
      // Form Buttons
      cy.contains('button', 'Register').should('be.visible');
      cy.contains('button', 'Clear').should('be.visible');
      cy.contains('button', 'Already registered? Login').should('be.visible');
    });

    it('should have a functional "Back to Home" button', () => {
      cy.get('.back-home-btn').should('be.visible').click();
      cy.url().should('include', '/');
    });

    it('should have a functional "Already registered? Login" link', () => {
      cy.contains('button', 'Already registered? Login').should('be.visible').click();
      cy.url().should('include', '/login');
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors when fields are empty', () => {
      cy.contains('button', 'Register').click();
      cy.contains('First Name is required').should('be.visible');
      cy.contains('Last Name is required').should('be.visible');
      cy.contains('Login is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('should clear form fields when "Clear" button is clicked', () => {
      cy.get('input[id="firstName"]').type('Test');
      cy.get('input[id="lastName"]').type('User');
      cy.get('input[id="login"]').type('testuser');
      cy.get('input[id="password"]').type('password123');

      cy.contains('button', 'Clear').click();
      
      cy.get('input[id="firstName"]').should('have.value', '');
      cy.get('input[id="lastName"]').should('have.value', '');
      cy.get('input[id="login"]').should('have.value', '');
      cy.get('input[id="password"]').should('have.value', '');
    });
  });

  describe('Register Flow', () => {
    it('should show an error message for already existing user', () => {
      cy.get('input[id="firstName"]').type(users.validRegularUser.firstName);
      cy.get('input[id="lastName"]').type(users.validRegularUser.lastName);
      cy.get('input[id="login"]').type(users.validRegularUser.login);
      cy.get('input[id="password"]').type(users.validRegularUser.password);

      cy.on('window:alert', (text) => {
          expect(text).to.contains('Something went wrong');
      });

      cy.contains('button', 'Register').click();

    });

    it('should navigate to the "/login" page after successful registration', () => {
      cy.get('input[id="firstName"]').type(users.validNewUser.firstName);
      cy.get('input[id="lastName"]').type(users.validNewUser.lastName);
      cy.get('input[id="login"]').type(users.validNewUser.login);
      cy.get('input[id="password"]').type(users.validNewUser.password);

      cy.on('window:alert', (text) => {
        expect(text).to.contains('Successful registration!');
      });

      cy.contains('button', 'Register').click();
      cy.url().should('include', '/login');
    });
  });

});

