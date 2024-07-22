import { faker } from "@faker-js/faker";

describe("Armies", () => {
  it("can be created", () => {
    const oldArmyName = faker.company.name();
    const armyName = faker.company.name();
    const oldUnitName = faker.commerce.department();
    const unitName = faker.commerce.department();
    const miniatureName = faker.commerce.productName();
    const overlyLongName = faker.lorem.words(50);

    cy.login();
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

    cy.location("pathname").should("equal", "/armies/new");
    cy.findByRole("textbox", { name: "Name" })
      .should("have.value", oldArmyName)
      .clear()
      .type(armyName);
    cy.findByRole("button", { name: "Add units" }).click();

    cy.location("pathname").should("match", /armies\/\d+\/units\/new/);
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
    cy.findByRole("textbox", { name: "Name" }).clear().type(oldUnitName);
    cy.findByRole("button", { name: "Save" }).click();

    cy.location("pathname").should("match", /armies\/\d+\/units\/new/);
    cy.findByRole("textbox", { name: "Name" })
      .should("have.value", oldUnitName)
      .clear()
      .type(unitName);
    cy.findByRole("button", { name: "Add models" }).click();

    cy.location("pathname").should("match", /units\/\d+\/miniatures\/new/);
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

    cy.location("pathname").should("match", /units\/\d+\/miniatures\/new/);
    cy.findByRole("link", { name: "Back to unit" }).click();

    cy.location("pathname").should("match", /armies\/\d+\/units\/new/);
    cy.findByRole("link", { name: "Back to army" }).click();

    cy.location("pathname").should("equal", "/armies/new");
    cy.findByRole("link", { name: "Back to account" }).click();

    cy.location("pathname").should("equal", "/account");
  });
});
