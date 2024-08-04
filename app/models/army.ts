import { z } from "zod";

export type { Army } from "@prisma/client";

const SHORT_TEXT_LIMIT = 255;
const LONG_TEXT_LIMIT = SHORT_TEXT_LIMIT * 4;
const MIN_REQUIRED_TEXT = 1;

const shortTextValidations = z
  .string()
  .min(MIN_REQUIRED_TEXT)
  .max(SHORT_TEXT_LIMIT);

const longTextValidations = z.string().max(LONG_TEXT_LIMIT);

const ArmyInput = z.object({
  name: shortTextValidations,
  gameSystem: shortTextValidations,
  faction: shortTextValidations,
  description: longTextValidations,
});

export function validate(army: unknown) {
  return ArmyInput.parseAsync(army);
}
