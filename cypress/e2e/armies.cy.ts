import { faker } from "@faker-js/faker";

describe("Armies", () => {
  const overlyLongName = faker.lorem.words(50);

  it("can be created", () => {
    const armyName = faker.company.name();
    const unitName = faker.commerce.department();
    const miniatureName = faker.commerce.productName();

    cy.login();
    cy.findByRole("link", { name: "Your armies" }).click();

    cy.location("pathname").should("equal", "/armies");
    cy.findByRole("link", { name: "Build an army" }).click();

    cy.location("pathname").should("equal", "/armies/new");
    cy.findByRole("heading", { name: "Build a new army" });
    cy.findByRole("textbox", { name: "Name" }).type(overlyLongName);
    cy.findByRole("textbox", { name: "Game system" }).type(
      faker.company.buzzPhrase(),
    );
    cy.findByRole("textbox", { name: "Faction" }).type(
      faker.company.buzzNoun(),
    );
    cy.findByRole("textbox", { name: "Description" }).type(
      faker.lorem.paragraph(),
    );
    cy.findByRole("button", { name: "Save" }).click();

    // Check serverside validations
    cy.findByText("String must contain at most 255 character(s)");
    cy.findByRole("textbox", { name: "Name" }).clear().type(armyName);
    cy.findByRole("button", { name: "Save" }).click();

    cy.findByRole("heading", { name: `Edit ${armyName}` });
    cy.findByRole("link", { name: "Add units" }).click();

    cy.findByRole("heading", { name: `Add a unit to ${armyName}` });
    cy.findByRole("textbox", { name: "Name" }).type(overlyLongName);
    cy.findByRole("textbox", { name: "Stats" }).type(faker.lorem.sentences());
    cy.findByRole("textbox", { name: "Gear" }).type(faker.lorem.sentences());
    cy.findByRole("textbox", { name: "Notes" }).type(faker.lorem.paragraph());
    cy.findByRole("combobox", { name: "Base shape" }).select("round");
    cy.findByRole("spinbutton", { name: "Base length (mm)" }).type("32");
    cy.findByRole("spinbutton", { name: "Base width (mm)" }).type("32");
    // Cypress doesn't have a nice way of handling color pickers, so the
    // recommended approach is to force the value + change event.
    cy.findByLabelText("Model color*")
      .invoke("val", "#ff0000")
      .trigger("change");
    cy.findByRole("button", { name: "Save" }).click();

    // Check serverside validations
    cy.findByText("String must contain at most 255 character(s)");
    cy.findByRole("textbox", { name: "Name" }).clear().type(unitName);
    cy.findByRole("button", { name: "Save" }).click();

    cy.findByRole("heading", { name: `Edit ${unitName}` });
    cy.findByRole("link", { name: "Add models" }).click();

    cy.findByRole("heading", { name: `Add a model to ${unitName}` });
    cy.findByRole("textbox", { name: "Name" }).type(overlyLongName);
    cy.findByRole("textbox", { name: "Stats" }).type(faker.lorem.sentences());
    cy.findByRole("textbox", { name: "Gear" }).type(faker.lorem.sentences());
    cy.findByRole("textbox", { name: "Notes" }).type(faker.lorem.paragraph());
    cy.findByRole("spinbutton", { name: "How many?" }).type("5");
    cy.findByRole("button", { name: "Save" }).click();

    // Check serverside validations
    cy.findByText("String must contain at most 255 character(s)");
    cy.findByRole("textbox", { name: "Name" }).clear().type(miniatureName);
    cy.findByRole("button", { name: "Save" }).click();

    cy.findByRole("heading", { name: `Edit ${miniatureName}` });
    cy.findByRole("link", { name: "Back to unit" }).click();

    // Check that records were saved
    cy.findByRole("heading", { name: `Edit ${unitName}` });
    cy.findByRole("row", { name: new RegExp(miniatureName) });
    cy.findByRole("link", { name: "Back to army" }).click();

    cy.findByRole("heading", { name: `Edit ${armyName}` });
    cy.findByRole("row", { name: new RegExp(unitName) });
    cy.findByRole("link", { name: "Back to armies" }).click();

    cy.location("pathname").should("equal", "/armies");
    cy.findByRole("row", { name: new RegExp(armyName) });
    cy.findByRole("link", { name: "Back to account" }).click();

    cy.location("pathname").should("equal", "/account");
  });

  it("can be edited", () => {
    const newArmyName = faker.company.name();
    const newUnitName = faker.commerce.department();
    const newMiniatureName = faker.commerce.productName();

    cy.resetFixtureArmy();
    cy.login();
    cy.findByRole("link", { name: "Your armies" }).click();

    cy.fixture("army").then((army) => {
      cy.findByRole("row", { name: new RegExp(army.name) })
        .findByLabelText("Edit")
        .click();

      cy.findByRole("heading", { name: `Edit ${army.name}` });
      cy.findByRole("textbox", { name: "Name" }).type(overlyLongName);
      cy.findByRole("button", { name: "Save" }).click();
      // Check serverside validations
      cy.findByText("String must contain at most 255 character(s)");
      cy.findByRole("textbox", { name: "Name" }).clear().type(newArmyName);
      cy.findByRole("button", { name: "Save" }).click();

      cy.fixture("unit").then((unit) => {
        cy.findByRole("row", { name: new RegExp(unit.name) })
          .findByLabelText("Edit")
          .click();
        cy.findByRole("heading", { name: `Edit ${unit.name}` });
        cy.findByRole("textbox", { name: "Name" }).type(overlyLongName);
        cy.findByRole("button", { name: "Save" }).click();
        // Check serverside validations
        cy.findByText("String must contain at most 255 character(s)");
        cy.findByRole("textbox", { name: "Name" }).clear().type(newUnitName);
        cy.findByRole("button", { name: "Save" }).click();

        cy.fixture("miniature").then((miniature) => {
          cy.findByRole("row", { name: new RegExp(miniature.name) })
            .findByLabelText("Edit")
            .click();
          cy.findByRole("heading", { name: `Edit ${miniature.name}` });
          cy.findByRole("textbox", { name: "Name" }).type(overlyLongName);
          cy.findByRole("button", { name: "Save" }).click();
          // Check serverside validations
          cy.findByText("String must contain at most 255 character(s)");
          cy.findByRole("textbox", { name: "Name" })
            .clear()
            .type(newMiniatureName);
          cy.findByRole("button", { name: "Save" }).click();
        });
      });
    });

    // Check that records were updated
    cy.findByRole("link", { name: "Back to unit" }).click();

    cy.findByRole("row", { name: new RegExp(newMiniatureName) });
    cy.findByRole("link", { name: "Back to army" }).click();

    cy.findByRole("row", { name: new RegExp(newUnitName) });
    cy.findByRole("link", { name: "Back to armies" }).click();

    cy.location("pathname").should("equal", "/armies");
    cy.findByRole("row", { name: new RegExp(newArmyName) });
  });

  it("redirects to /armies when unauthorized", () => {
    cy.fixture("wrong-user").then(({ email, password, username }) => {
      cy.login(email, password);
      cy.findByRole("heading", username);
      cy.visit("/armies/1/edit");
      cy.findByRole("heading", { name: "Your armies" });

      cy.findByRole("link", { name: "Back to account" }).click();
      cy.findByRole("heading", { name: username });
      cy.visit("/units/1/miniatures/1/edit");
      cy.findByRole("heading", { name: "Your armies" });
    });
  });
});
