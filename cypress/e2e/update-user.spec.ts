describe('Update User Page', () => {
  const users = require('../fixtures/users.json');

  beforeEach(() => {
    cy.login('admin');
    cy.intercept('GET', '/api/read-user/1').as('getUser');
    cy.visit('/crud/update-user/1');
    cy.wait('@getUser');
  });

  describe('UI Elements', () => {
    it('should display the main UI elements', () => {
      cy.contains('h2', 'Update User Form').should('be.visible');
      cy.contains('button', 'Update').should('be.visible');
      cy.contains('button', 'Clear').should('be.visible');
      cy.contains('button', 'Back').should('be.visible');
    });
  });

  describe('Form State', () => {
    it('should prefill the form with the loaded user data', () => {
      cy.get('input[id="firstName"]').should('have.value', 'John');
      cy.get('input[id="lastName"]').should('have.value', 'Doe');
      cy.get('input[id="login"]').should('have.value', 'johndoe');
      cy.get('input[id="password"]').should('have.value', '');
      cy.get('select[id="role"]').should('have.value', 'USER');
    });

    it('should clear form fields when "Clear" button is clicked', () => {
      cy.get('input[id="firstName"]').clear().type(users.validCreatedUser.firstName);
      cy.get('input[id="lastName"]').clear().type(users.validCreatedUser.lastName);
      cy.get('input[id="login"]').clear().type(users.validCreatedUser.login);
      cy.get('input[id="password"]').type(users.validCreatedUser.password);
      cy.get('select[id="role"]').select(users.validCreatedUser.role);

      cy.contains('button', 'Clear').click();

      cy.get('input[id="firstName"]').should('have.value', '');
      cy.get('input[id="lastName"]').should('have.value', '');
      cy.get('input[id="login"]').should('have.value', '');
      cy.get('input[id="password"]').should('have.value', '');
      cy.get('select[id="role"]').should('have.value', null);
    });
  });

  describe('Form Submission', () => {
    it('should update the user and show success message', () => {
      cy.intercept('PUT', '/api/update-user/1').as('updateUser');

      cy.get('input[id="firstName"]').clear().type('John');
      cy.get('input[id="lastName"]').clear().type('Doe');
      cy.get('input[id="login"]').clear().type(users.validCreatedUser.login);
      cy.get('input[id="password"]').type(users.validCreatedUser.password);
      cy.get('select[id="role"]').select(users.validCreatedUser.role);

      cy.on('window:alert', (text) => {
        expect(text).to.contains('User updated successfully!');
      });

      cy.contains('button', 'Update').click();
      cy.wait('@updateUser');
      cy.url().should('include', '/crud/list-user');
    });

    it('should show an error message when the update request fails', () => {
      let message = 'Failed to update user';
      cy.intercept('PUT', '/api/update-user/1', {
        statusCode: 500,
        body: { message: message },
      }).as('updateUserError');

      cy.get('input[id="firstName"]').clear().type('John');
      cy.get('input[id="lastName"]').clear().type('Doe');
      cy.get('input[id="login"]').clear().type(users.validCreatedUser.login);
      cy.get('input[id="password"]').type(users.validCreatedUser.password);
      cy.get('select[id="role"]').select(users.validCreatedUser.role);

      cy.on('window:alert', (text) => {
        expect(text).to.contains('Something went wrong: ' + message);
      });

      cy.contains('button', 'Update').click();
      cy.wait('@updateUserError');
    });

    it('should redirect to list users when the route id is invalid', () => {
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Invalid user id.');
      });

      cy.visit('/crud/update-user/0');
      cy.url().should('include', '/crud/list-user');
    });
  });
});

