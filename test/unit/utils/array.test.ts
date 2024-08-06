import { wrap } from "../../../app/utils/array";

describe("wrap", () => {
  describe("when object is not an array", () => {
    const object = {};

    it("wraps the object in an array", () => {
      expect(wrap(object)).toEqual([object]);
    });
  });

  describe("when object is an array", () => {
    const object = [{}];

    it("doesn't change the object", () => {
      expect(wrap(object)).toEqual(object);
    });
  });
});
