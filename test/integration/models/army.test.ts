import { armyInputFactory } from "../../factories/army";
import db from "../../../app/.server/db";
import { findArmy, Army } from "../../../app/models/army";
import { userInputFactory } from "../../factories/user";

describe("findArmy", () => {
  describe("when the army exists", () => {
    let army: Army;

    beforeEach(async () => {
      const { id: userId } = await db.user.create({
        data: userInputFactory.build(),
      });
      army = await db.army.create({
        data: armyInputFactory.build({ userId: userId }),
      });
    });

    it("returns the army record", async () => {
      expect(await findArmy(army.id)).toMatchObject(army);
    });
  });

  describe("when the army doesn't exist", () => {
    it("returns null", async () => {
      expect(await findArmy(-1)).toBeNull();
    });
  });
});
