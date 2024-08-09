import { z } from "zod";

import db, { Army } from "../.server/db";
import { Unit } from "./unit";
import { AssertionError } from "assert";
export type { Army } from "../.server/db";

type FindArmyOptions = Omit<
  Parameters<typeof db.army.findUniqueOrThrow>[0],
  "where"
>;
type ArmyWithUnits = Army & { units: Unit[] };

const SHORT_TEXT_LIMIT = 255;
const LONG_TEXT_LIMIT = SHORT_TEXT_LIMIT * 4;
const MIN_REQUIRED_TEXT = 1;

export function assertHasUnits(
  army: Army | ArmyWithUnits,
): asserts army is ArmyWithUnits {
  if ((army as ArmyWithUnits).units === undefined) {
    throw new AssertionError();
  }
}

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
  userId: z.number().int().min(1),
});

export function validateArmy(army: unknown) {
  return ArmyInput.parseAsync(army);
}

export function findArmy(id: number, options?: FindArmyOptions) {
  return db.army.findUniqueOrThrow({ ...options, where: { id } });
}
