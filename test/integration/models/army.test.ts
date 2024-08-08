import { armyInputFactory } from "../../factories/army";
import db from "../../../app/.server/db";
import { findArmy, Army } from "../../../app/models/army";
import { userInputFactory } from "../../factories/user";

describe("find", () => {
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
    it("throws an error", async () => {
      expect.assertions(1);

      try {
        await findArmy(-1);
      } catch (e) {
        expect((e as Error).message).toEqual("No Army found");
      }
    });
  });
});
