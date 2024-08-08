import { z } from "zod";
import isHexColor from "validator/lib/isHexColor";
import db from "../.server/db";

export type { Unit } from "../.server/db";

const SHORT_TEXT_LIMIT = 255;
const LONG_TEXT_LIMIT = SHORT_TEXT_LIMIT * 4;
const MIN_REQUIRED_TEXT = 1;
const MIN_REQUIRED_NUMBER = 1;

const shortTextValidations = z
  .string()
  .min(MIN_REQUIRED_TEXT)
  .max(SHORT_TEXT_LIMIT);

const longTextValidations = z.string().max(LONG_TEXT_LIMIT);

const UnitInput = z.object({
  name: shortTextValidations,
  stats: longTextValidations,
  gear: longTextValidations,
  notes: longTextValidations,
  baseLength: z.number().int().min(MIN_REQUIRED_NUMBER),
  baseWidth: z.number().int().min(MIN_REQUIRED_NUMBER),
  color: z.string().refine(isHexColor, "Color must be a hex color code."),
});

export function validateUnit(unit: unknown) {
  return UnitInput.parseAsync(unit);
}

export function findUnit(id: number) {
  return db.unit.findUniqueOrThrow({ where: { id } });
}
