import { PrismaClient } from "@prisma/client";

export type { Game } from "@prisma/client";

const db = new PrismaClient();

export default db;
