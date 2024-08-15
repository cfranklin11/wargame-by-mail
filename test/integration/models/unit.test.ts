import { unitInputFactory } from "../../factories/unit";
import db from "../../../app/.server/db";
import { findUnit, findUnitBy, Unit } from "../../../app/models/unit";
import { armyInputFactory } from "../../factories/army";
import { userInputFactory } from "../../factories/user";
import { baseShapeInputFactory } from "../../factories/baseShape";

describe("findUnit", () => {
  describe("when the unit exists", () => {
    let unitId: number;
    const unit = unitInputFactory.build();

    beforeAll(async () => {
      const { id: userId } = await db.user.create({
        data: userInputFactory.build(),
      });
      const { id: armyId } = await db.army.create({
        data: armyInputFactory.build({ userId }),
      });
      const { id: baseShapeId } = await db.baseShape.create({
        data: baseShapeInputFactory.build(),
      });
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

describe("findUnitBy", () => {
  describe("when the unit exists", () => {
    let unit: Unit;

    beforeAll(async () => {
      const unitInput = unitInputFactory.build();

      const { id: userId } = await db.user.create({
        data: userInputFactory.build(),
      });
      const { id: armyId } = await db.army.create({
        data: armyInputFactory.build({ userId }),
      });
      const { id: baseShapeId } = await db.baseShape.create({
        data: baseShapeInputFactory.build(),
      });
      unit = await db.unit.create({
        data: { ...unitInput, baseShapeId, armyId },
      });
    });

    it("returns the unit record", async () => {
      expect(
        await findUnitBy({
          name: unit.name,
          armyId: unit.armyId,
        }),
      ).toMatchObject(unit);
    });
  });

  describe("when the unit doesn't exist", () => {
    it("returns null", async () => {
      expect(
        await findUnitBy({
          name: "Definitely not a real name",
          armyId: -1,
        }),
      ).toBeNull();
    });
  });
});
