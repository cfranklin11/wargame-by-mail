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

// Basic client for use in validations
const prisma = new PrismaClient();

const UserCreateInput = z.object({
  email: z
    .string()
    .email()
    .max(255)
    .refine(
      async (email) => {
        const user = await prisma.user.findUnique({ where: { email } });
        return !user;
      },
      { message: "An account for this email already exists" },
    ),
  password: z.string().min(8).max(255),
  username: z
    .string()
    .min(1)
    .max(255)
    .refine(
      async (username) => {
        const user = await prisma.user.findUnique({ where: { username } });
        return !user;
      },
      { message: "Username already taken" },
    ),
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
  },
});

export default db;
