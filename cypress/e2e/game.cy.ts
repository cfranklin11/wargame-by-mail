describe("Creating a new game", () => {
  it("creates the game", () => {
    cy.visit("/");
    cy.findByRole("link", { name: "Start a game" }).click();

    cy.location("pathname").should("match", /\/games\/new/);
    cy.findByRole("heading", { name: "Set up a new game" });
    cy.findByLabelText("Name*").type("My Super Sweet Test Game");
    cy.findByLabelText("Description").type(
      "It's mine. It's super sweet. It's for testing. It's a game.",
    );
    cy.findByRole("button", { name: "Create game" }).click();

    cy.location("pathname").should("match", /\/games\/\d+\/terrains\/new/);
    cy.findByRole("heading", { name: "Add terrain" });
    const terrainName = "Some ruins";
    cy.findByLabelText("Name*").type(terrainName);
    cy.findByLabelText("Type*").select("ruins");
    cy.findByLabelText("Shape*").select("rectangle");
    cy.findByLabelText("Width (in)*").type("4");
    cy.findByLabelText("Height (in)*").type("2");
    cy.findByLabelText("Angle (degrees)*").type("45");
    cy.findByLabelText("Center x-coordinate (in)*").type("40");
    cy.findByLabelText("Center y-coordinate (in)*").type("20");
    cy.findByLabelText("Notes").type("Very haunted. Very scary");
    cy.findByRole("button", { name: "Add terrain" }).click();

    cy.findByRole("row", { name: terrainName });
    cy.findByRole("link", { name: "Start game" }).click();

    cy.location("pathname").should("match", /\/games\/\d+\/play/);
    cy.findByRole("heading", { name: "Play Game" });
  });
});
