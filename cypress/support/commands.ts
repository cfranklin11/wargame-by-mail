import "@testing-library/cypress/add-commands";

/// <reference types="cypress" />

Cypress.Commands.add("login", (email, password) => {
  cy.fixture("user").then(
    ({ email: defaultEmail, password: defaultPassword }) => {
      cy.visit("/login");
      cy.location("pathname").should("equal", "/login");
      cy.findByRole("heading", { name: "Log in" });

      cy.findByRole("textbox", { name: "Email" }).type(email || defaultEmail);
      cy.findByLabelText("Password*").type(password || defaultPassword);
      cy.findByRole("button", { name: "Log in" }).click();

      cy.location("pathname").should("equal", "/account");
    },
  );
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
    }
  }
}
