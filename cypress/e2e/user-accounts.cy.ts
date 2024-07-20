import { faker } from "@faker-js/faker";

describe("User", () => {
  it("can sign up", () => {
    const username = faker.internet.userName();
    const email = faker.internet.email();

    cy.visit("/");
    cy.findByRole("link", { name: "Sign up" }).click();

    cy.location("pathname").should("equal", "/signup");
    cy.findByRole("heading", { name: "Sign up" });
    cy.findByLabelText("Email*").type(email);
    cy.findByLabelText("Password*").type("short");
    cy.findByLabelText("Username*").type(username);
    cy.findByRole("button", { name: "Create account" }).click();

    // Check serverside validations
    cy.findByText("String must contain at least 8 character(s)");
    cy.findByLabelText("Password*").type(
      faker.internet.password({ length: 8 }),
    );
    cy.findByRole("button", { name: "Create account" }).click();

    cy.location("pathname").should("match", /users\/\d+/);
    cy.findByRole("heading", { name: username });

    // Check database constraints
    cy.visit("/signup");
    cy.findByRole("heading", { name: "Sign up" });
    cy.findByLabelText("Email*").type(email);
    cy.findByLabelText("Password*").type(
      faker.internet.password({ length: 8 }),
    );
    cy.findByLabelText("Username*").type(username);
    cy.findByRole("button", { name: "Create account" }).click();

    cy.findByText("Username already taken");
    cy.findByText("An account for this email already exists");
    cy.location("pathname").should("equal", "/signup");
  });
});
