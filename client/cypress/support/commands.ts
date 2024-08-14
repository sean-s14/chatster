/// <reference types="cypress" />

Cypress.Commands.add("login", (email, password) => {
  cy.session([email, password], () => {
    // This is to ensure the access token is available
    cy.intercept("POST", "**/oauth/token").as("authRequest");

    cy.visit(Cypress.env("VITE_BASE_URL"));
    cy.get("#login").click();

    cy.origin(
      Cypress.env("VITE_AUTH0_DOMAIN"),
      { args: { email, password } },
      ({ email, password }) => {
        cy.get("#username").type(email);
        cy.get("#password").type(password);
        cy.get('button[type="submit"][name="action"]').click();
      }
    );

    cy.wait("@authRequest"); // This is to ensure the access token is available

    cy.get("h1").should("contain", "Welcome to Chatster!");
  });
});

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(email: string, password: string): Chainable<any>;
  }
}
