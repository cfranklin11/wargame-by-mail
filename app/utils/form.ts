import invariant from "tiny-invariant";
import { ZodError } from "zod";
import * as R from "ramda";

const EMPTY_ERRORS: Record<string, string[]> = {};

export function formatValidationErrors(error: ZodError) {
  return error.issues.reduce((aggValue, currValue) => {
    const key = currValue.path[0];
    invariant(typeof key === "string");

    const aggMessages = Object.keys(aggValue).includes(key)
      ? aggValue[key]
      : [];

    return {
      ...aggValue,
      [key]: [...aggMessages, currValue.message],
    };
  }, EMPTY_ERRORS);
}

export function convertToModelData(formData: FormData) {
  return R.pipe(
    R.invoker(0, "entries"),
    R.map(([key, value]) => [
      key,
      Number.isNaN(parseInt(value)) ? value : parseInt(value),
    ]),
    Object.fromEntries,
  )(formData);
}
