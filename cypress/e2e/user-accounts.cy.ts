describe("Creating an account", () => {
  it("creates the account", () => {
    cy.visit("/");
    cy.findByRole("link", { name: "Sign up" }).click();

    const username = "username";
    cy.location("pathname").should("equal", "/signup");
    cy.findByRole("heading", { name: "Sign up" });
    cy.findByLabelText("Email*").type("test@wargamebymail.com");
    cy.findByLabelText("Password*").type("password");
    cy.findByLabelText("Username*").type(username);
    cy.findByRole("button", { name: "Create account" }).click();

    cy.location("pathname").should("match", /users\/\d+/);
    cy.findByRole("heading", { name: username });
  });
});
