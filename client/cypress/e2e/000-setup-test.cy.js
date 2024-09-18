describe("Setup Test", () => {
  const BASE_URL = Cypress.env("VITE_BASE_URL");
  const email = Cypress.env("AUTH_TEST_EMAIL");
  const password = Cypress.env("AUTH_TEST_PASSWORD");

  it("should signup with a test user", () => {
    cy.visit(`${BASE_URL}/signup`);

    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.get("#password2").type(password);
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/login");
  });

  it("should login with a test user", () => {
    cy.visit(`${BASE_URL}/login`);

    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should("eq", `${BASE_URL}/`);
    cy.get("h1").should("contain", "Welcome to Chatster!");
  });
});
