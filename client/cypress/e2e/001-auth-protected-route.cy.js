describe("Protected Routes With Authentication", () => {
  const BASE_URL = Cypress.env("VITE_BASE_URL");
  const email = Cypress.env("AUTH_TEST_EMAIL");
  const password = Cypress.env("AUTH_TEST_PASSWORD");

  beforeEach(() => {
    cy.login(email, password);
  });

  it("should load the settings page", () => {
    cy.visit(`${BASE_URL}/settings`);
    cy.get("h1").should("contain", "Settings");
    cy.get("p").should("contain", "Username");
    cy.get("p").should("contain", "Name");
    cy.get("p").should("contain", "Email");
    cy.get("p").contains("Email").siblings("p").should("contain", email);
  });
});
