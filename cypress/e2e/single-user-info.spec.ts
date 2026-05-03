

describe('Single User Info Page', () => {
  const users = require('../fixtures/users.json');
  function formatDateToString(dateString: string): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid input date.");
    }

    const pad = (num: number) => num.toString().padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); 
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };
  
  beforeEach(() => {
    cy.login('admin');
    cy.intercept('GET', '/api/read-user/1').as('getUser');
    cy.visit('/crud/read-user/1');
    cy.wait('@getUser');
  });

  describe('UI Elements', () => {
    it('should display the main UI elements', () => {
      // header UI elements
      cy.contains('div', `${users.singleUserInfo.firstName.charAt(0)}${users.singleUserInfo.lastName.charAt(0)}`).should('be.visible');
      cy.contains('p', 'User profile').should('be.visible');
      cy.contains('h1', `${users.singleUserInfo.firstName} ${users.singleUserInfo.lastName}`).should('be.visible');
      cy.contains('p', users.singleUserInfo.login).should('be.visible');
      cy.contains('span', users.singleUserInfo.role).should('be.visible');
      cy.contains('button', 'Back').should('be.visible');

      // Other non-functional UI elements
      cy.contains('h2', 'Identity').should('be.visible');
      
      cy.contains('dt', 'ID').should('be.visible');
      cy.contains('dd', users.singleUserInfo.id).should('be.visible');

      cy.contains('dt', 'First Name').should('be.visible');
      cy.contains('dd', users.singleUserInfo.firstName).should('be.visible');

      cy.contains('dt', 'Last Name').should('be.visible');
      cy.contains('dd', users.singleUserInfo.lastName).should('be.visible');

      cy.contains('dt', 'Login').should('be.visible');
      cy.contains('dd', users.singleUserInfo.login).should('be.visible');
      
      cy.contains('dt', 'Role').should('be.visible');
      cy.contains('dd', users.singleUserInfo.role).should('be.visible');
      
      cy.contains('dt', 'Created At').should('be.visible');
      cy.contains('dd', formatDateToString(users.singleUserInfo.createdAt)).should('be.visible');
      
      cy.contains('dt', 'Updated At').should('be.visible');
      cy.contains('dd', formatDateToString(users.singleUserInfo.updatedAt)).should('be.visible');

      cy.contains('h2', 'Actions').should('be.visible');

      // Buttons
      cy.contains('button', 'Back to users list').should('be.visible');
      cy.contains('button', 'Edit User').should('be.visible');
      cy.contains('button', 'Delete User').should('be.visible');
    });
  });

  describe('Button functionality', () => {
    describe('"Back to users list" button', () => {
      it('should navigate back to the "/crud/users-list" page', () => {
        cy.contains('button', 'Back to users list').should('be.visible').click();
        cy.url().should('include', '/crud/list-user');
      });
    });
    
    describe('"Edit User" button', () => {
      it('should navigate to the update user page for the displayed user', () => {
        cy.contains('button', 'Edit User').should('be.visible').click();
        cy.url().should('include', '/crud/update-user/1');
      });
      
    });

    describe('"Delete User" button', () => {
      it('should delete the user when confirmed and navigate back to the users list page', () => {
        cy.intercept('DELETE', '/api/delete-user/1').as('deleteUser');
        cy.on('window:confirm', () => true);

        cy.contains('button', 'Delete User').should('be.visible').click();
        cy.wait('@deleteUser');
        
        cy.url().should('include', '/crud/list-user');
      });

      it('should not delete the user when deletion is cancelled and should stay on the same page', () => {
        cy.on('window:confirm', () => false);

        cy.contains('button', 'Delete User').should('be.visible').click();
        
        cy.url().should('include', '/crud/read-user/1');
      });

      it('should show an error alert if the deletion fails', () => {
        const errorMessage = 'Internal Server Error';
        cy.intercept('DELETE', '/api/delete-user/1', {
          statusCode: 500,
          body: { error: errorMessage },
        }).as('deleteUserError');

        cy.on('window:confirm', () => true);

        cy.contains('button', 'Delete User').should('be.visible').click();
        cy.wait('@deleteUserError');

        cy.on('window:alert', (text) => {
          expect(text).to.include('Unable to delete user:');
          expect(text).to.include(errorMessage);
        });
      });

    });

  });

});

