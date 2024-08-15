describe("Protected Routes Without Authentication", () => {
  const BASE_URL = Cypress.env("VITE_BASE_URL");
  const VITE_AUTH0_DOMAIN = Cypress.env("VITE_AUTH0_DOMAIN");

  it("should load the auth0 authentication page", () => {
    cy.visit(`${BASE_URL}/settings`);

    cy.origin(VITE_AUTH0_DOMAIN, () => {
      cy.get("input[name=username]").should("exist");
      cy.get("input[name=password]").should("exist");
      cy.get("button[type=submit]").should("exist");
    });
  });
});
