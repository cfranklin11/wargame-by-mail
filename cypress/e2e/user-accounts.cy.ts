import { faker } from "@faker-js/faker";

describe("User accounts", () => {
  it("can sign up", () => {
    const username = faker.internet.userName();
    const email = faker.internet.email();

    cy.visit("/");
    cy.findByRole("link", { name: "Sign up" }).click();

    cy.location("pathname").should("equal", "/signup");
    cy.findByRole("heading", { name: "Sign up" });

    cy.findByRole("textbox", { name: "Username" }).type(username);
    cy.findByRole("textbox", { name: "Email" }).type(email);
    cy.findByLabelText("Password*").type("short");
    cy.findByRole("button", { name: "Create account" }).click();

    // Check serverside validations
    cy.findByText("String must contain at least 8 character(s)");
    cy.findByLabelText("Password*").type(
      faker.internet.password({ length: 8 }),
    );
    cy.findByRole("button", { name: "Create account" }).click();

    cy.location("pathname").should("equal", "/account");
    cy.findByRole("heading", { name: username });

    // Check database constraints
    cy.visit("/signup");
    cy.findByRole("heading", { name: "Sign up" });

    cy.findByRole("textbox", { name: "Username" }).type(username);
    cy.findByRole("textbox", { name: "Email" }).type(email);
    cy.findByLabelText("Password*").type(
      faker.internet.password({ length: 8 }),
    );
    cy.findByRole("button", { name: "Create account" }).click();

    cy.findByText("Username already taken");
    cy.findByText("An account for this email already exists");
    cy.location("pathname").should("equal", "/signup");
  });

  it("can log in and out", () => {
    cy.visit("/");
    cy.findByRole("link", { name: "Log in" }).click();

    cy.location("pathname").should("equal", "/login");
    cy.findByRole("heading", { name: "Log in" });

    cy.fixture("user").then(({ username, email, password }) => {
      cy.findByLabelText("Email*").type(email);
      cy.findByLabelText("Password*").type(
        "prettysurenotarealpasswordkthnxbyebbq",
      );
      cy.findByRole("button", { name: "Log in" }).click();
      cy.findByText("Either the email or password are incorrect");
      cy.findByLabelText("Password*").clear().type(password);
      cy.findByRole("button", { name: "Log in" }).click();

      cy.location("pathname").should("equal", "/account");
      cy.findByRole("heading", { name: username });

      cy.findByRole("button", { name: username }).click();
      cy.findByRole("menuitem", { name: "Log out" }).click();
      cy.location("pathname").should("equal", "/login");
      cy.visit("/account");
      cy.location("pathname").should("equal", "/login");
      cy.findByRole("heading", { name: "Log in" });
    });
  });
});
