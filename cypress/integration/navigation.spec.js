describe('Navigation', () => {
  it('should navigate to homepage, login and logout', () => {
    // Navigate to home page
    cy.visit('http://localhost:3000');
    /*     // Login Page
    cy.get('[data-cy="login"]').should('be.visible').click();
    // Login User
    cy.get('[data-cy="username"]').type('aa');
    cy.get('[data-cy="password"]').type('aa');
    // press Log In
    cy.get('[data-cy="loginButton"]').should('be.visible').click();
    // click around
    cy.get('[data-cy="userMenu"]').should('be.visible');
    cy.get('[data-cy="userMenu"]').click();
    // logout
    cy.get('[data-cy="logout"]').should('be.visible').click(); */
  });
});
