describe("Authentication with Auth0", () => {
  const BASE_URL = Cypress.env("VITE_BASE_URL");
  const email = Cypress.env("AUTH0_TEST_EMAIL");
  const password = Cypress.env("AUTH0_TEST_PASSWORD");

  beforeEach(() => {
    cy.login(email, password);
  });

  it("should load the error page", () => {
    cy.visit(`${BASE_URL}/non-existent-page`);
    cy.get("p").should("contain", "Sorry, an unexpected error has occurred.");
  });

  it("should load the settings page", () => {
    cy.visit(`${BASE_URL}/settings`);
    cy.get("h1").should("contain", "Settings");
    cy.get("p").should("contain", "Name");
    cy.get("p").should("contain", "Email");
    cy.get("p").eq(1).should("contain", email);
  });
});
