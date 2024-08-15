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

Cypress.Commands.add("resetFixtureArmy", () => {
  cy.fixture("army").then((army) => {
    cy.fixture("unit").then((unit) => {
      cy.fixture("miniature").then((miniature) => {
        // Kind of cheating here, because dynamically fetching the IDs
        // of these records would be a pain, and I know that they're the
        // first ones created via seeds.
        const FIXTURE_ID = 1;
        cy.task("resetArmy", {
          army: { id: FIXTURE_ID, ...army },
          units: [{ id: FIXTURE_ID, ...unit }],
          miniatures: [{ id: FIXTURE_ID, ...miniature }],
        });
      });
    });
  });
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      resetFixtureArmy(): Chainable<void>;
    }
  }
}
