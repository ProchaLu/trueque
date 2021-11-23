describe('Navigation', () => {
  it('should navigate to most pages and check for some content', () => {
    // Navigate to home page
    cy.visit('http://localhost:3000');
    // Login Page
    cy.get('[data-cy="login"]').should('be.visible').click();
    // Login User
    cy.get('[data-cy="username"]').type('aa');
    cy.get('[data-cy="password"]').type('aa');
    // press Log In
    cy.get('[data-cy="loginButton"]').should('be.visible').click();
  });
});
