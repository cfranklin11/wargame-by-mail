import { miniatureInputFactory } from "../../factories/miniature";
import db from "../../../app/.server/db";
import {
  findMiniature,
  findMiniatureBy,
  Miniature,
} from "../../../app/models/miniature";
import { unitInputFactory } from "../../factories/unit";
import { armyInputFactory } from "../../factories/army";
import { userInputFactory } from "../../factories/user";
import { baseShapeInputFactory } from "../../factories/baseShape";

describe("findMiniature", () => {
  describe("when the miniature exists", () => {
    let miniatureId: number;
    const miniature = miniatureInputFactory.build();

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
      const { id: unitId } = await db.unit.create({
        data: { ...unitInputFactory.build(), baseShapeId, armyId },
      });
      miniatureId = (
        await db.miniature.create({ data: { ...miniature, unitId } })
      ).id;
    });

    it("returns the miniature record", async () => {
      expect(await findMiniature(miniatureId)).toMatchObject(miniature);
    });
  });

  describe("when the miniature doesn't exist", () => {
    it("throws an error", async () => {
      expect.assertions(1);

      try {
        await findMiniature(-1);
      } catch (e) {
        expect((e as Error).message).toEqual("No Miniature found");
      }
    });
  });
});

describe("findMiniatureBy", () => {
  describe("when the miniature exists", () => {
    let miniature: Miniature;

    beforeAll(async () => {
      const miniatureInput = miniatureInputFactory.build();

      const { id: userId } = await db.user.create({
        data: userInputFactory.build(),
      });
      const { id: armyId } = await db.army.create({
        data: armyInputFactory.build({ userId }),
      });
      const { id: baseShapeId } = await db.baseShape.create({
        data: baseShapeInputFactory.build(),
      });
      const { id: unitId } = await db.unit.create({
        data: { ...unitInputFactory.build(), baseShapeId, armyId },
      });
      miniature = await db.miniature.create({
        data: { ...miniatureInput, unitId },
      });
    });

    it("returns the miniature record", async () => {
      expect(
        await findMiniatureBy({
          name: miniature.name,
          unitId: miniature.unitId,
        }),
      ).toMatchObject(miniature);
    });
  });

  describe("when the miniature doesn't exist", () => {
    it("returns null", async () => {
      expect(
        await findMiniatureBy({
          name: "Definitely not a real name",
          unitId: -1,
        }),
      ).toBeNull();
    });
  });
});
