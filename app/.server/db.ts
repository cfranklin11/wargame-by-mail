import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { wrap } from "~/utils/array";
import { validate as validateArmy } from "~/models/army";
import { validate as validateUnit } from "~/models/unit";

export type {
  Game,
  Terrain,
  User,
  Army,
  BaseShape,
  Unit,
  Miniature,
} from "@prisma/client";

const SHORT_TEXT_LIMIT = 255;
const LONG_TEXT_LIMIT = SHORT_TEXT_LIMIT * 4;
const MIN_PASSWORD_LENGTH = 8;
const MIN_REQUIRED_TEXT = 1;

const MIN_REQUIRED_NUMBER = 1;

// Basic client for use in validations
const prisma = new PrismaClient();

const shortTextValidations = z
  .string()
  .min(MIN_REQUIRED_TEXT)
  .max(SHORT_TEXT_LIMIT);

const longTextValidations = z.string().max(LONG_TEXT_LIMIT);

const UserCreateInput = z.object({
  email: shortTextValidations.email().refine(
    async (email) => {
      const user = await prisma.user.findUnique({ where: { email } });
      return !user;
    },
    { message: "An account for this email already exists" },
  ),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(SHORT_TEXT_LIMIT),
  username: shortTextValidations.refine(
    async (username) => {
      const user = await prisma.user.findUnique({ where: { username } });
      return !user;
    },
    { message: "Username already taken" },
  ),
});

const MiniatureCreateInput = z.object({
  name: shortTextValidations,
  stats: longTextValidations,
  gear: longTextValidations,
  notes: longTextValidations,
  count: z.number().int().min(MIN_REQUIRED_NUMBER),
});

const db = new PrismaClient().$extends({
  query: {
    user: {
      create: async ({ args, query }) => {
        await UserCreateInput.parseAsync(args.data);
        const password = args.data.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return query({
          ...args,
          data: { ...args.data, password: hashedPassword },
        });
      },
      createMany: async ({ args, query }) => {
        const data = await Promise.all(
          wrap(args.data).map(async (userData) => {
            await UserCreateInput.parseAsync(userData);
            const password = userData.password;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            return { ...userData, password: hashedPassword };
          }),
        );
        return query({
          ...args,
          data,
        });
      },
    },
    army: {
      create: async ({ args, query }) => {
        await validateArmy(args.data);
        return query(args);
      },
      createMany: async ({ args, query }) => {
        await Promise.all(wrap(args.data).map(validateArmy));
        return query(args);
      },
    },
    unit: {
      create: async ({ args, query }) => {
        await validateUnit(args.data);
        return query(args);
      },
      createMany: async ({ args, query }) => {
        await Promise.all(wrap(args.data).map(validateUnit));
        return query(args);
      },
    },
    miniature: {
      create: async ({ args, query }) => {
        await MiniatureCreateInput.parseAsync(args.data);
        return query(args);
      },
      createMany: async ({ args, query }) => {
        await Promise.all(
          wrap(args.data).map((data) => MiniatureCreateInput.parseAsync(data)),
        );
        return query(args);
      },
    },
  },
});

export default db;
