import { PrismaClient } from "@prisma/client";
import { z } from "zod";

export type { User } from "@prisma/client";

const SHORT_TEXT_LIMIT = 255;
const MIN_REQUIRED_TEXT = 1;
const MIN_PASSWORD_LENGTH = 8;

const shortTextValidations = z
  .string()
  .min(MIN_REQUIRED_TEXT)
  .max(SHORT_TEXT_LIMIT);

const UserInput = (validationDb: PrismaClient) =>
  z.object({
    email: shortTextValidations.email().refine(
      async (email) => {
        const user = await validationDb.user.findUnique({ where: { email } });
        return !user;
      },
      { message: "An account for this email already exists" },
    ),
    password: z.string().min(MIN_PASSWORD_LENGTH).max(SHORT_TEXT_LIMIT),
    username: shortTextValidations.refine(
      async (username) => {
        const user = await validationDb.user.findUnique({
          where: { username },
        });
        return !user;
      },
      { message: "Username already taken" },
    ),
  });

export function validate(validationDb: PrismaClient, user: unknown) {
  return UserInput(validationDb).parseAsync(user);
}
