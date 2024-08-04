import { ZodError } from "zod";
import { formatValidationErrors } from "../../app/utils/form";

describe("formatValidationError", () => {
  const error = new ZodError([
    {
      code: "invalid_type",
      expected: "string",
      received: "number",
      path: ["name"],
      message: "Gotta be a string",
    },
    {
      code: "unrecognized_keys",
      keys: ["key1", "keys"],
      path: ["stuff"],
      message: "Bad keys",
    },
  ]);
  it("builds an object of form validation errors", () => {
    expect(formatValidationErrors(error)).toEqual({
      name: ["Gotta be a string"],
      stuff: ["Bad keys"],
    });
  });
});
