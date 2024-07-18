import { PrismaClient } from "@prisma/client";

export type { Game, Terrain, User } from "@prisma/client";

const db = new PrismaClient();

export default db;
