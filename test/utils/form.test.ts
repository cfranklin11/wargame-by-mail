import { ZodError } from "zod";
import * as form from "../../app/utils/form";

describe("formatValidationErrors", () => {
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
    expect(form.formatValidationErrors(error)).toEqual({
      name: ["Gotta be a string"],
      stuff: ["Bad keys"],
    });
  });
});

describe("convertToModelData", () => {
  const formData = new FormData();

  beforeAll(() => {
    formData.set("name", "My Name");
    formData.set("description", "");
    formData.set("count", "42");
  });

  it("parses numeric values", () => {
    expect(form.convertToModelData(formData)).toMatchObject({ count: 42 });
  });

  it("has the same keys and values as the form data", () => {
    expect(form.convertToModelData(formData)).toEqual({
      name: "My Name",
      description: "",
      count: 42,
    });
  });
});
