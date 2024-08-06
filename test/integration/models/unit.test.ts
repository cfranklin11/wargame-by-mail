import { unitInputFactory } from "../../factories/unit";
import db from "../../../app/.server/db";
import * as unitModule from "../../../app/models/unit";
import { armyInputFactory } from "../../factories/army";

describe("find", () => {
  describe("when the unit exists", () => {
    let unitId: number;
    const unit = unitInputFactory.build();

    beforeEach(async () => {
      const { id: baseShapeId } = await db.baseShape.findFirstOrThrow();
      const { id: armyId } = await db.army.create({
        data: armyInputFactory.build(),
      });
      unitId = (
        await db.unit.create({ data: { ...unit, baseShapeId, armyId } })
      ).id;
    });

    it("returns the unit record", async () => {
      expect(await unitModule.find(unitId)).toMatchObject(unit);
    });
  });

  describe("when the unit doesn't exist", () => {
    it("throws an error", async () => {
      expect.assertions(1);

      try {
        await unitModule.find(-1);
      } catch (e) {
        expect((e as Error).message).toEqual("No Unit found");
      }
    });
  });
});
