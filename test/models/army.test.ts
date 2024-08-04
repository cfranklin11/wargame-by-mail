import * as R from "ramda";
import { ZodError } from "zod";

import { armyInputFactory } from "../factories/army";
import * as armyModel from "../../app/models/army";

describe("validate", () => {
  const validArmyInput = armyInputFactory.build();

  describe("when all attributes are valid", () => {
    const army = validArmyInput;

    it("returns the army object", async () => {
      expect(await armyModel.validate(army)).toEqual(army);
    });
  });

  describe("when short-text attributes have too many characters", () => {
    const tooLongString = R.repeat("yo", 130).join();
    const army = {
      ...validArmyInput,
      name: tooLongString,
      gameSystem: tooLongString,
      faction: tooLongString,
    };

    it("throws a validation error", async () => {
      expect.assertions(1);

      try {
        await armyModel.validate(army);
      } catch (error) {
        expect((error as ZodError).issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ["name"], code: "too_big" }),
            expect.objectContaining({ path: ["gameSystem"], code: "too_big" }),
            expect.objectContaining({ path: ["faction"], code: "too_big" }),
          ]),
        );
      }
    });
  });
});
