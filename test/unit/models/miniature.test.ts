import * as R from "ramda";
import { ZodError } from "zod";

import { miniatureInputFactory } from "../../factories/miniature";
import * as miniatureModel from "../../../app/models/miniature";

describe("validate", () => {
  const validMiniatureInput = miniatureInputFactory.build();

  describe("when all attributes are valid", () => {
    const miniature = validMiniatureInput;

    it("returns the miniature object", async () => {
      expect(await miniatureModel.validate(miniature)).toEqual(miniature);
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
        await miniatureModel.validate(miniature);
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
        await miniatureModel.validate(miniature);
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
        await miniatureModel.validate(miniature);
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
