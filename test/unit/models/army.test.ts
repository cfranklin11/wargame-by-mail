import * as R from "ramda";
import { ZodError } from "zod";
import { AssertionError } from "assert";

import { armyFactory, armyInputFactory } from "../../factories/army";
import { assertHasUnits, validateArmy } from "../../../app/models/army";
import { unitFactory } from "../../factories/unit";

describe("validateArmy", () => {
  const validArmyInput = armyInputFactory.build();

  describe("when all attributes are valid", () => {
    const army = validArmyInput;

    it("returns the army object", async () => {
      expect(await validateArmy(army)).toEqual(R.omit(["userId"])(army));
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
        await validateArmy(army);
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

describe("assertHasUnits", () => {
  describe("when it has units", () => {
    const units = unitFactory.build();
    const army = { ...armyFactory.build(), units };

    it("doesn't throw an error", () => {
      expect(() => assertHasUnits(army)).not.toThrow();
    });
  });

  describe("when it doesn't have units", () => {
    const army = armyFactory.build();

    it("throws an AssertionError", () => {
      expect(() => assertHasUnits(army)).toThrow(AssertionError);
    });
  });
});
