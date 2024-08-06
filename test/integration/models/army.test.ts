import { armyInputFactory } from "../../factories/army";
import db from "../../../app/.server/db";
import * as armyModule from "../../../app/models/army";

describe("find", () => {
  describe("when the army exists", () => {
    let armyId: number;
    const army = armyInputFactory.build();

    beforeEach(async () => {
      armyId = (await db.army.create({ data: army })).id;
    });

    it("returns the army record", async () => {
      expect(await armyModule.find(armyId)).toMatchObject(army);
    });
  });

  describe("when the army doesn't exist", () => {
    it("throws an error", async () => {
      expect.assertions(1);

      try {
        await armyModule.find(-1);
      } catch (e) {
        expect((e as Error).message).toEqual("No Army found");
      }
    });
  });
});
