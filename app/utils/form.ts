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

const isNumeric = (value: string) =>
  ![parseInt(value), Number(value)].some(Number.isNaN);
export function convertToModelData(formData: FormData) {
  return R.pipe(
    R.invoker(0, "entries"),
    R.map(([key, value]) => [
      key,
      R.ifElse(isNumeric, Number, R.identity)(value),
    ]),
    Object.fromEntries,
  )(formData);
}
