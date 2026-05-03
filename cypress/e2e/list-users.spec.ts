describe('List Users Page', () => {
  const users = require('../fixtures/users.json');
  const userList = require('../fixtures/list-users.json');

  beforeEach(() => {
    cy.login('admin');
    cy.intercept('GET', '/api/read-user', userList).as('getUsers');
    cy.visit('/crud/list-user');
    cy.wait('@getUsers');
  });

  // describe('UI Elements', () => {
  //   it('should display the main UI elements', () => {
  //     // header UI elements
  //     cy.contains('h2', 'Users Directory').should('be.visible');
  //     cy.contains('p', 'Browse, view, and manage library users.').should('be.visible');
  //   });
  // });

  // describe('User List Display', () => {
  //   it('should display the list of users', () => {
  //     cy.contains('th', 'Id').should('be.visible');
  //     cy.contains('th', 'Firstname').should('be.visible');
  //     cy.contains('th', 'Lastname').should('be.visible');
  //     cy.contains('th', 'Role').should('be.visible');

  //     // Check that the users from the fixture are displayed
  //     userList.forEach((user: any) => {
  //       cy.contains('td', user.id).should('be.visible');
  //       cy.contains('td', user.firstName).should('be.visible');
  //       cy.contains('td', user.lastName).should('be.visible');
  //       cy.contains('td', user.role).should('be.visible');
  //       // Check that the action buttons are present for each user
  //       cy.contains('tr', user.id.toString())
  //         .and('contain', user.firstName).
  //         and('contain', user.lastName).
  //         within(() => {
  //         cy.contains('button', 'View').should('be.visible');
  //         cy.contains('button', 'Edit').should('be.visible');
  //         cy.contains('button', 'Delete').should('be.visible');
  //       });
  //     });
  //   });
  // });

  describe('Button functionality', () => {
    describe('"View button', () => {
      it('should navigate to the "/crud/read-user/userId" page', () => {
        cy.contains('button', 'View').should('be.visible').click();
        cy.url().should('include', `/crud/read-user/${userList[0].id}`);
      });

      it('should remain on the list page if the user details cannot be loaded', () => {
        cy.intercept('GET', `/api/read-user/${userList[0].id}`, {
          statusCode: 500,
          body: { error: 'Internal Server Error' },
         }).as('getUserError');

        cy.contains('button', 'View').should('be.visible').click();
        cy.wait('@getUserError');
        cy.url().should('include', "/crud/list-user");
      });

    });
    
    describe('"Edit" button', () => {
      it('should navigate to the update user page for the displayed user', () => {
        cy.contains('button', 'Edit').should('be.visible').click();
        cy.url().should('include', `/crud/update-user/${userList[0].id}`);
      });

      it('should remain on the list page if the update user form cannot be loaded for editing', () => {
        cy.intercept('GET', `/api/read-user/${userList[0].id}`, {
          statusCode: 500,
          body: { error: 'Internal Server Error' },
         }).as('getUserError');

        cy.contains('button', 'Edit').should('be.visible').click();
        cy.wait('@getUserError');
        cy.url().should('include', "/crud/list-user");
      });

    });

    describe('"Delete" button', () => {
      it('should delete the user when confirmed and navigate back to the users list page', () => {
        cy.intercept('DELETE', `/api/delete-user/${userList[0].id}`).as('deleteUser');
        cy.on('window:confirm', () => true);

        cy.contains('button', 'Delete').should('be.visible').click();
        cy.wait('@deleteUser');

        // After deletion, the user should no longer be visible in the list
        cy.contains('td', userList[0].id).should('not.exist');
        cy.contains('td', userList[0].firstName).should('not.exist');
        cy.contains('td', userList[0].lastName).should('not.exist');
        cy.contains('td', userList[0].role).should('not.exist');

        // Check that the URL is still correct after deletion (should stay on the list page)
        cy.url().should('include', '/crud/list-user');
        
      });

      it('should not delete the user when deletion is cancelled and should stay on the same page', () => {
        cy.on('window:confirm', () => false);

        cy.contains('button', 'Delete').should('be.visible').click();

        // Check that the user is still visible in the list after the failed deletion attempt
        cy.contains('td', userList[0].id).should('be.visible');
        cy.contains('td', userList[0].firstName).should('be.visible');
        cy.contains('td', userList[0].lastName).should('be.visible');
        cy.contains('td', userList[0].role).should('be.visible');
        
      });

      it('should show an error alert if the deletion fails', () => {
        const errorMessage = 'Internal Server Error';
        cy.intercept('DELETE', `/api/delete-user/${userList[0].id}`, {
          statusCode: 500,
          body: { error: errorMessage },
        }).as('deleteUserError');

        cy.on('window:confirm', () => true);

        cy.contains('button', 'Delete').should('be.visible').click();

        cy.wait('@deleteUserError');

        cy.on('window:alert', (text) => {
          expect(text).to.include('Unable to delete user:');
          expect(text).to.include(errorMessage);
        });

        // Check that the user is still visible in the list after the failed deletion attempt
        cy.contains('td', userList[0].id).should('be.visible');
        cy.contains('td', userList[0].firstName).should('be.visible');
        cy.contains('td', userList[0].lastName).should('be.visible');
        cy.contains('td', userList[0].role).should('be.visible');

        // Check that the URL is still correct after the failed deletion attempt (should stay on the list page)
        cy.url().should('include', '/crud/list-user');
      });

    });

  });

});

