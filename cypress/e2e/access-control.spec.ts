describe('Access control', () => {
  it('should redirect an unauthenticated user trying to access admin panel to login', () => {
    cy.on('window:alert', (text) => {
      expect(text).to.include('You must be logged in to access the platflorm.');
    });

    cy.visit('/admin-pannel');

    cy.url().should('include', '/login');
  });

  it('should redirect a regular user away from the admin panel to book references', () => {
    cy.login('user');
    cy.visit('/admin-pannel');

    cy.url().should('include', '/book-references');
  });

  it('should redirect a regular user away from CRUD pages to login', () => {
    cy.login('user');
    cy.visit('/crud/list-user');

    cy.url().should('include', '/login');
  });
});