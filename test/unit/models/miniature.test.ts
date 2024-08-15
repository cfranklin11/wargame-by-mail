import * as R from "ramda";
import { ZodError } from "zod";
import { AssertionError } from "assert";

import {
  miniatureFactory,
  miniatureInputFactory,
} from "../../factories/miniature";
import {
  assertHasUnit,
  validateMiniature,
} from "../../../app/models/miniature";
import { unitFactory } from "../../factories/unit";

describe("validate", () => {
  const validMiniatureInput = miniatureInputFactory.build();

  describe("when all attributes are valid", () => {
    const miniature = validMiniatureInput;

    it("returns the miniature object", async () => {
      expect(await validateMiniature(miniature)).toEqual(miniature);
    });
  });

  describe("when short-text attributes have too many characters", () => {
    const tooLongString = R.repeat("yo", 130).join();
    const miniature = {
      ...validMiniatureInput,
      name: tooLongString,
    };

    it("throws a validation error", async () => {
      expect.assertions(1);

      try {
        await validateMiniature(miniature);
      } catch (error) {
        expect((error as ZodError).issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ["name"], code: "too_big" }),
          ]),
        );
      }
    });
  });

  describe("when count is 0", () => {
    const miniature = {
      ...validMiniatureInput,
      count: 0,
    };

    it("throws a validation error", async () => {
      expect.assertions(1);

      try {
        await validateMiniature(miniature);
      } catch (error) {
        expect((error as ZodError).issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ["count"], code: "too_small" }),
          ]),
        );
      }
    });
  });

  describe("when base dimensions are negative", () => {
    const miniature = {
      ...validMiniatureInput,
      count: -42,
    };

    it("throws a validation error", async () => {
      expect.assertions(1);

      try {
        await validateMiniature(miniature);
      } catch (error) {
        expect((error as ZodError).issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ["count"], code: "too_small" }),
          ]),
        );
      }
    });
  });
});

describe("assertHasUnit", () => {
  describe("when it has a unit", () => {
    const unit = unitFactory.build();
    const miniature = { ...miniatureFactory.build(), unit };

    it("doesn't throw an error", () => {
      expect(() => assertHasUnit(miniature)).not.toThrow();
    });
  });

  describe("when it doesn't have units", () => {
    const miniature = miniatureFactory.build();

    it("throws an AssertionError", () => {
      expect(() => assertHasUnit(miniature)).toThrow(AssertionError);
    });
  });
});
