describe('Register', () => {
  it('should register user and delete the user', () => {
    // Navigate to home page
    cy.visit('http://localhost:3000');
    // Login Page
    /*     cy.get('[data-cy="signUp"]').should('be.visible').click();
    // Login User
    cy.get('[data-cy="registerUsername"]').type('dd');
    cy.get('[data-cy="registerPassword"]').type('dd');
    cy.get('[data-cy="registerName"]').type('dd');
    cy.get('[data-cy="registerMail"]').type('dd');
    cy.get('[data-cy="registerAddress"]').type('dd');
    // press Log In
    cy.get('[data-cy="registerButton"]').should('be.visible').click();
    // click around
    cy.get('[data-cy="itemPage"]').should('be.visible').click();
    // header menu
    cy.get('[data-cy="userMenu"]').should('be.visible').click();
    // profile page
    cy.get('[data-cy="profile"]').should('be.visible').click();
    // delete user
    cy.get('[data-cy="profileDelete"]').should('be.visible').click(); */
  });
});
