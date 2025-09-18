describe("Project Flow", () => {
  it("logs in, creates project, sees it in table", () => {
    cy.visit("/login");

    cy.get("input[name=email]").type("admin@test.com");
    cy.get("input[name=password]").type("password123{enter}");

    cy.url().should("include", "/dashboard");

    cy.contains("New Project").click();

    cy.get("input[name=title]").type("Cypress Test Project");
    cy.get("input[name=beneficiaries]").type("200");
    cy.contains("Submit").click();

    cy.contains("Cypress Test Project").should("exist");
  });
});
