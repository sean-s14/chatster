describe("Routes", () => {
  const BASE_URL = Cypress.env("VITE_BASE_URL");

  it("should load the home page", () => {
    cy.visit(`${BASE_URL}/`);
    cy.get("h1").should("contain", "Welcome to Chatster!");
  });

  it("should load the error page", () => {
    cy.visit(`${BASE_URL}/non-existent-page`);
    cy.get("p").should("contain", "Sorry, an unexpected error has occurred.");
    cy.get("p").should("contain", "Not Found");
  });
});
