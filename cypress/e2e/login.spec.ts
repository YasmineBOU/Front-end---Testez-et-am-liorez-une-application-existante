describe('Login Page', () => {
  const users = require('../fixtures/users.json');
  const localStorage = require('../fixtures/localStorage.json');
  const regexJwtToken = /^[^.]+\.[^.]+\.[^.]+$/;

  beforeEach(() => {
    cy.visit('/login');
  });

  describe('UI Elements', () => {

    it('should display all the required UI elements', () => {
      // Main title of the form
      cy.contains('h2', 'Login Form').should('be.visible');
      // Back to Home button
      cy.get('.back-home-btn').should('be.visible');  
      // Form fields and their labels
      cy.contains('label', 'Login').should('be.visible');
      cy.get('input[id="login"]').should('be.visible');
      
      cy.contains('label', 'Password').should('be.visible');
      cy.get('input[id="password"]').should('be.visible');
      // Form Buttons
      cy.contains('button', 'Login').should('be.visible');
      cy.contains('button', 'Clear').should('be.visible');
      cy.contains('button', 'Not registered? Register').should('be.visible');
    });

    it('should have a functional "Back to Home" button', () => {
      cy.get('.back-home-btn').should('be.visible').click();
      cy.url().should('include', '/');
    });

    it('should have a functional "Not registered? Register" link', () => {
      cy.contains('button', 'Not registered? Register').should('be.visible').click();
      cy.url().should('include', '/register');
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors when fields are empty', () => {
      cy.contains('button', 'Login').click();
      cy.contains('Login is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('should clear form fields when "Clear" button is clicked', () => {
      cy.get('input[id="login"]').type('testuser');
      cy.get('input[id="password"]').type('password123');

      cy.contains('button', 'Clear').click();
      
      cy.get('input[id="login"]').should('have.value', '');
      cy.get('input[id="password"]').should('have.value', '');
    });
  });

  describe('Authentication Flow', () => {
    describe('Error Handling', () => {
      const invalidCredentialsErrorStatuses = [400, 401, 403];
      
      describe('Invalid Credentials', () => {
        invalidCredentialsErrorStatuses.forEach((status) => {
          it(`should show an error message for ${status}`, () => {
              cy.get('input[id="login"]').type(users.invalidUser.login);
              cy.get('input[id="password"]').type(users.invalidUser.password);

            cy.on('window:alert', (text) => {
              expect(text).to.contains('Incorrect credentials, please try again.');
            });

            cy.contains('button', 'Login').click();
          });
        });
      });

      describe('Other Errors', () => {
        it('should show a generic error message for any other status code', () => {
          cy.get('input[id="login"]').type(users.serverErrorUser.login);
          cy.get('input[id="password"]').type(users.serverErrorUser.password);

          cy.on('window:alert', (text) => {
              expect(text).to.contains('An error occurred, please try again later.');
          });

          cy.contains('button', 'Login').click();
        });
      });
    });

    describe('LocalStorage Handling', () => {

      it('should store the token and logged in user for Admin User in localStorage after successful login', () => {
        cy.get('input[id="login"]').type(users.validAdminUser.login);
        cy.get('input[id="password"]').type(users.validAdminUser.password);
        
        cy.contains('button', 'Login').click();
        
        cy.window().its('localStorage').invoke('getItem', localStorage.tokenKey).should('exist');
        cy.window().its('localStorage').invoke('getItem', localStorage.loggedInUserKey).should('exist');            
      });

      it('should store the token and logged in user for any lambda user in localStorage after successful login', () => {
        cy.get('input[id="login"]').type(users.validRegularUser.login);
        cy.get('input[id="password"]').type(users.validRegularUser.password);

        cy.contains('button', 'Login').click();

        cy.window().its('localStorage').invoke('getItem', localStorage.tokenKey).should('exist');
        cy.window().its('localStorage').invoke('getItem', localStorage.loggedInUserKey).should('exist');
      });
        
    });

    it('should navigate to the "/admin-pannel" page after successful login', () => {
      cy.get('input[id="login"]').type(users.validAdminUser.login);
      cy.get('input[id="password"]').type(users.validAdminUser.password);

      cy.contains('button', 'Login').click();

      cy.window().its('localStorage').invoke('getItem', localStorage.tokenKey).should('match', regexJwtToken);
      cy.window().its('localStorage').invoke('getItem', localStorage.loggedInUserKey).should('eq', users.validAdminUser.login);
      cy.url().should('include', '/admin-pannel');
    });

  });

});

