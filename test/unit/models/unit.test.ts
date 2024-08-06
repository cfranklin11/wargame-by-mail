import * as R from "ramda";
import { ZodError } from "zod";

import { unitInputFactory } from "../../factories/unit";
import * as unitModel from "../../../app/models/unit";

describe("validate", () => {
  const validUnitInput = unitInputFactory.build();

  describe("when all attributes are valid", () => {
    const unit = validUnitInput;

    it("returns the unit object", async () => {
      expect(await unitModel.validate(unit)).toEqual(unit);
    });
  });

  describe("when short-text attributes have too many characters", () => {
    const tooLongString = R.repeat("yo", 130).join();
    const unit = {
      ...validUnitInput,
      name: tooLongString,
    };

    it("throws a validation error", async () => {
      expect.assertions(1);

      try {
        await unitModel.validate(unit);
      } catch (error) {
        expect((error as ZodError).issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ["name"], code: "too_big" }),
          ]),
        );
      }
    });
  });

  describe("when the color isn't a hex color value", () => {
    const unit = {
      ...validUnitInput,
      color: "notacolor",
    };

    it("throws a validation error", async () => {
      expect.assertions(1);

      try {
        await unitModel.validate(unit);
      } catch (error) {
        expect((error as ZodError).issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ["color"], code: "custom" }),
          ]),
        );
      }
    });
  });

  describe("when base dimensions are 0", () => {
    const unit = {
      ...validUnitInput,
      baseLength: 0,
      baseWidth: 0,
    };

    it("throws a validation error", async () => {
      expect.assertions(1);

      try {
        await unitModel.validate(unit);
      } catch (error) {
        expect((error as ZodError).issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["baseLength"],
              code: "too_small",
            }),
            expect.objectContaining({ path: ["baseWidth"], code: "too_small" }),
          ]),
        );
      }
    });
  });

  describe("when base dimensions are negative", () => {
    const unit = {
      ...validUnitInput,
      baseLength: -42,
      baseWidth: -42,
    };

    it("throws a validation error", async () => {
      expect.assertions(1);

      try {
        await unitModel.validate(unit);
      } catch (error) {
        expect((error as ZodError).issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["baseLength"],
              code: "too_small",
            }),
            expect.objectContaining({ path: ["baseWidth"], code: "too_small" }),
          ]),
        );
      }
    });
  });
});
