describe('Create User Page', () => {

  const users = require('../fixtures/users.json');

  beforeEach(() => {
    cy.login('admin');
    cy.visit('/crud/create-user');
  });

  describe('UI Elements', () => {

    it('should display the main UI elements', () => {
      // Main title of the form
      cy.contains('h2', 'Create New User').should('be.visible');
      // Buttons
      cy.contains('button', 'Create User').should('be.visible');
      cy.contains('button', 'Clear').should('be.visible');
    });
  });

  describe('Functionality', () => {

    it('should clear form fields when "Clear" button is clicked', () => {
      cy.get('input[id="firstName"]').type(users.validCreatedUser.firstName);
      cy.get('input[id="lastName"]').type(users.validCreatedUser.lastName);
      cy.get('input[id="login"]').type(users.validCreatedUser.login);
      cy.get('input[id="password"]').type(users.validCreatedUser.password);
      cy.get('select[id="role"]').select(users.validCreatedUser.role);

      cy.contains('button', 'Clear').click();
      cy.get('input[id="firstName"]').should('have.value', '');
      cy.get('input[id="lastName"]').should('have.value', '');
      cy.get('input[id="login"]').should('have.value', '');
      cy.get('input[id="password"]').should('have.value', '');
      cy.get('select[id="role"]').should('have.value', null);
    });

    describe('Form Submission', () => {

      it('should create a new user and show success message', () => {
        cy.get('input[id="firstName"]').type(users.validCreatedUser.firstName);
        cy.get('input[id="lastName"]').type(users.validCreatedUser.lastName);
        cy.get('input[id="login"]').type(users.validCreatedUser.login);
        cy.get('input[id="password"]').type(users.validCreatedUser.password);
        cy.get('select[id="role"]').select(users.validCreatedUser.role);

        cy.on('window:alert', (text) => {
          expect(text).to.contains('User created successfully!');
        }); 

        cy.contains('button', 'Create User').click();
        cy.url().should('include', '/admin-pannel');
      }); 

      it('should show an error message when trying to create a user with an existing login', () => {
        cy.get('input[id="firstName"]').type(users.validRegularUser.firstName);
        cy.get('input[id="lastName"]').type(users.validRegularUser.lastName);
        cy.get('input[id="login"]').type(users.validRegularUser.login);
        cy.get('input[id="password"]').type(users.validRegularUser.password);
        cy.get('select[id="role"]').select(users.validRegularUser.role);

        cy.on('window:alert', (text) => {
          expect(text).to.contains('Something went wrong');
        });

        cy.contains('button', 'Create User').click();
      });
    });

  });

});

