import { idFromParams } from "../../../app/utils/request";

describe("idFromParams", () => {
  const idKey = "id";
  const idFromIdParam = idFromParams(idKey);

  describe("when it's a numeric string", () => {
    const params = { id: "42" };

    it("returns a number", () => {
      expect(idFromIdParam(params)).toEqual(42);
    });
  });

  describe("when it doesn't exist", () => {
    const params = { anotherId: "42" };

    it("throws an error", () => {
      expect(() => idFromIdParam(params)).toThrow("Invariant failed");
    });
  });

  describe("when it's not a numeric string", () => {
    const params = { id: "blahblahblah" };

    it("returns NaN", () => {
      expect(idFromIdParam(params)).toEqual(NaN);
    });
  });
});
