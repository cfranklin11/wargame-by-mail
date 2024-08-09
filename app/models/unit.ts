import { z } from "zod";
import isHexColor from "validator/lib/isHexColor";

import db, { Unit } from "../.server/db";
import { Miniature } from "./miniature";
import { AssertionError } from "assert";

export type { Unit } from "../.server/db";

type FindUnitOptions = Omit<
  Parameters<typeof db.unit.findUniqueOrThrow>[0],
  "where"
>;
export type UnitWithMiniatures = Unit & { miniatures: Miniature[] };

const SHORT_TEXT_LIMIT = 255;
const LONG_TEXT_LIMIT = SHORT_TEXT_LIMIT * 4;
const MIN_REQUIRED_TEXT = 1;
const MIN_REQUIRED_NUMBER = 1;

export function assertHasMiniatures(
  unit: Unit | UnitWithMiniatures,
): asserts unit is UnitWithMiniatures {
  if ((unit as UnitWithMiniatures).miniatures === undefined) {
    throw new AssertionError();
  }
}

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

export function findUnit(id: number, options?: FindUnitOptions) {
  return db.unit.findUniqueOrThrow({ ...options, where: { id } });
}
