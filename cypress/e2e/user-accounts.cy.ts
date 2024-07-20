import { faker } from "@faker-js/faker";

const SEEDED_USER = {
  username: "testuser",
  email: "testuser@wargamebymail.com",
  password: "supersecretsauce",
};

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

  it("can log in and out", () => {
    cy.visit("/");
    cy.findByRole("link", { name: "Log in" }).click();

    cy.location("pathname").should("equal", "/login");
    cy.findByRole("heading", { name: "Log in" });

    cy.findByLabelText("Email*").type(SEEDED_USER.email);
    cy.findByLabelText("Password*").type(
      "prettysurenotarealpasswordkthnxbyebbq",
    );
    cy.findByRole("button", { name: "Log in" }).click();
    cy.findByText("Either the email or password are incorrect");
    cy.findByLabelText("Password*").clear().type(SEEDED_USER.password);
    cy.findByRole("button", { name: "Log in" }).click();

    cy.location("pathname").should("match", /users\/\d+/);
    cy.findByRole("heading", { name: SEEDED_USER.username });

    cy.findByRole("button", { name: "Log out" }).click();
    cy.location("pathname").should("equal", "/login");
    cy.visit("/users/1");
    cy.location("pathname").should("equal", "/login");
    cy.findByRole("heading", { name: "Log in" });
  });
});
