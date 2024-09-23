describe("Routes", () => {
  const BASE_URL = Cypress.env("VITE_BASE_URL");
  const email = Cypress.env("AUTH_TEST_EMAIL");
  const password = Cypress.env("AUTH_TEST_PASSWORD");

  beforeEach(() => {
    cy.login(email, password);
  });

  it("should delete the test account", () => {
    cy.visit(`${BASE_URL}/settings`);
    cy.get("h1").should("contain", "Settings");
    cy.get("button").contains("Delete Account").click();
    cy.get("button").contains("Continue").click();
    cy.url().should("eq", `${BASE_URL}/`);
  });
});
