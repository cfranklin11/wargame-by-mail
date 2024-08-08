import { unitInputFactory } from "../../factories/unit";
import db from "../../../app/.server/db";
import { findUnit } from "../../../app/models/unit";
import { armyInputFactory } from "../../factories/army";
import { userInputFactory } from "../../factories/user";

describe("find", () => {
  describe("when the unit exists", () => {
    let unitId: number;
    const unit = unitInputFactory.build();

    beforeEach(async () => {
      const { id: userId } = await db.user.create({
        data: userInputFactory.build(),
      });
      const { id: armyId } = await db.army.create({
        data: armyInputFactory.build({ userId }),
      });
      const { id: baseShapeId } = await db.baseShape.findFirstOrThrow();
      unitId = (
        await db.unit.create({ data: { ...unit, baseShapeId, armyId } })
      ).id;
    });

    it("returns the unit record", async () => {
      expect(await findUnit(unitId)).toMatchObject(unit);
    });
  });

  describe("when the unit doesn't exist", () => {
    it("throws an error", async () => {
      expect.assertions(1);

      try {
        await findUnit(-1);
      } catch (e) {
        expect((e as Error).message).toEqual("No Unit found");
      }
    });
  });
});
