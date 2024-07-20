import { parseArgs } from "node:util";
import db from "~/.server/db";

async function seedTestData() {
  await db.$transaction(async (tx) => {
    await tx.user.createMany({
      data: [
        {
          username: "testuser",
          email: "testuser@wargamebymail.com",
          password: "supersecretsauce",
        },
      ],
    });
  });
}

async function main() {
  await db.$transaction(async (tx) => {
    await tx.terrainType.createMany({
      data: [{ name: "woods" }, { name: "ruins" }, { name: "crater" }],
    });
    await tx.terrainShape.createMany({
      data: [{ name: "rectangle" }, { name: "oval" }],
    });
  });

  const {
    values: { environment },
  } = parseArgs({
    options: {
      environment: { type: "string" },
    },
  });

  if (environment === "test") {
    await seedTestData();
  }
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await db.$disconnect());
