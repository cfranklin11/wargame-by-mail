import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { wrap } from "../utils/array";
import { validateArmy } from "../models/army";
import { validateUnit } from "../models/unit";
import { validateMiniature } from "../models/miniature";
import { validateUser } from "../models/user";

export type {
  Game,
  Terrain,
  BaseShape,
  Army,
  Unit,
  Miniature,
} from "@prisma/client";

// Basic client for use in validations
const prisma = new PrismaClient();

const db = new PrismaClient().$extends({
  query: {
    user: {
      create: async ({ args, query }) => {
        await validateUser(prisma, args.data);
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
            await validateUser(prisma, userData);
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
        await validateMiniature(args.data);
        return query(args);
      },
      createMany: async ({ args, query }) => {
        await Promise.all(wrap(args.data).map(validateMiniature));
        return query(args);
      },
    },
  },
});

export default db;
