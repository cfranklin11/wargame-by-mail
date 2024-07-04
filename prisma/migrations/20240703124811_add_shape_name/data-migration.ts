import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.terrainType.createMany({
      data: [{ name: "woods" }, { name: "ruins" }, { name: "crater" }],
    });
    await tx.terrainShape.createMany({
      data: [{ name: "rectangle" }, { name: "oval" }],
    });
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
