describe("Protected Routes Without Authentication", () => {
  const BASE_URL = Cypress.env("VITE_BASE_URL");

  it("should load the unauthorized page", () => {
    cy.visit(`${BASE_URL}/settings`);
    cy.url().should("include", "/login");
  });
});
