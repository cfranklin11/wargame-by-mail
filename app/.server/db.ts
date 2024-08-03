import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";

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

// Basic client for use in validations
const prisma = new PrismaClient();

const UserCreateInput = z.object({
  email: z
    .string()
    .email()
    .max(SHORT_TEXT_LIMIT)
    .refine(
      async (email) => {
        const user = await prisma.user.findUnique({ where: { email } });
        return !user;
      },
      { message: "An account for this email already exists" },
    ),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(SHORT_TEXT_LIMIT),
  username: z
    .string()
    .min(1)
    .max(SHORT_TEXT_LIMIT)
    .refine(
      async (username) => {
        const user = await prisma.user.findUnique({ where: { username } });
        return !user;
      },
      { message: "Username already taken" },
    ),
});

const ArmyCreateInput = z.object({
  name: z.string().min(1).max(SHORT_TEXT_LIMIT),
  gameSystem: z.string().min(1).max(SHORT_TEXT_LIMIT),
  faction: z.string().min(1).max(SHORT_TEXT_LIMIT),
  description: z.string().max(LONG_TEXT_LIMIT),
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
          (Array.isArray(args.data) ? args.data : [args.data]).map(
            async (userData) => {
              await UserCreateInput.parseAsync(userData);
              const password = userData.password;
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(password, salt);
              return { ...userData, password: hashedPassword };
            },
          ),
        );
        return query({
          ...args,
          data,
        });
      },
    },
    army: {
      create: async ({ args, query }) => {
        await ArmyCreateInput.parseAsync(args.data);
        return query(args);
      },
      createMany: async ({ args, query }) => {
        await Promise.all(
          (Array.isArray(args.data) ? args.data : [args.data]).map((data) =>
            ArmyCreateInput.parseAsync(data),
          ),
        );
        return query(args);
      },
    },
  },
});

export default db;
