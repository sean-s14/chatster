/// <reference types="cypress" />

Cypress.Commands.add("login", (email, password) => {
  cy.session([email, password], () => {
    const BASE_URL = Cypress.env("VITE_BASE_URL");
    cy.visit(`${BASE_URL}/login`);

    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.get('button[type="submit"]').click();

    // Ensure the user is redirected to the home page
    cy.url().should("eq", `${BASE_URL}/`);
    cy.get("h1").should("contain", "Welcome to Chatster!");
  });
});

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(email: string, password: string): Chainable<any>;
  }
}
