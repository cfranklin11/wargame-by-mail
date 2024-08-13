import { z } from "zod";

import db from "../.server/db";
export type { Miniature } from "../.server/db";

type FindMiniatureOptions = Omit<
  Parameters<typeof db.miniature.findFirst>[0],
  "where"
>;
// Prisma won't let me access the "where" key, because it's optional,
// so I'm just omitting every other key in the param
type FindMiniatureConditions = Omit<
  Parameters<typeof db.miniature.findFirst>[0],
  "select" | "include" | "orderBy" | "cursor" | "take" | "skip" | "distinct"
>;

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

export function validateMiniature(miniature: unknown) {
  return MiniatureInput.parseAsync(miniature);
}

export function findMiniature(id: number) {
  return db.miniature.findUniqueOrThrow({ where: { id } });
}

export function findMiniatureBy(
  conditions: FindMiniatureConditions,
  options?: FindMiniatureOptions,
) {
  return db.miniature.findFirst({ where: conditions, ...options });
}
