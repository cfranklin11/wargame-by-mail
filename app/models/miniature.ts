import { z } from "zod";

export type { Miniature } from "@prisma/client";

const SHORT_TEXT_LIMIT = 255;
const LONG_TEXT_LIMIT = SHORT_TEXT_LIMIT * 4;
const MIN_REQUIRED_TEXT = 1;
const MIN_REQUIRED_NUMBER = 1;

const shortTextValidations = z
  .string()
  .min(MIN_REQUIRED_TEXT)
  .max(SHORT_TEXT_LIMIT);

const longTextValidations = z.string().max(LONG_TEXT_LIMIT);

const MiniatureInput = z.object({
  name: shortTextValidations,
  stats: longTextValidations,
  gear: longTextValidations,
  notes: longTextValidations,
  count: z.number().int().min(MIN_REQUIRED_NUMBER),
});

export function validate(army: unknown) {
  return MiniatureInput.parseAsync(army);
}
