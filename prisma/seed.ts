import { parseArgs } from "node:util";

import db from "~/.server/db";
import fixtureUser from "../cypress/fixtures/user.json";
import fixtureWrongUser from "../cypress/fixtures/wrong-user.json";
import fixtureArmy from "../cypress/fixtures/army.json";
import fixtureUnit from "../cypress/fixtures/unit.json";
import fixtureMiniature from "../cypress/fixtures/miniature.json";

async function seedBaseData() {
  await Promise.all([
    db.baseShape.createMany({
      data: [{ name: "square" }, { name: "round" }],
    }),
    db.terrainType.createMany({
      data: [{ name: "woods" }, { name: "ruins" }, { name: "crater" }],
    }),
    db.terrainShape.createMany({
      data: [{ name: "rectangle" }, { name: "oval" }],
    }),
  ]);
}

async function seedTestData() {
  await db.user.create({ data: fixtureWrongUser });
  const { id: userId } = await db.user.create({ data: fixtureUser });
  const { id: armyId } = await db.army.create({
    data: { ...fixtureArmy, userId },
  });
  const { id: baseShapeId } = await db.baseShape.findFirstOrThrow();
  const { id: unitId } = await db.unit.create({
    data: { ...fixtureUnit, armyId, baseShapeId },
  });
  await db.miniature.create({ data: { ...fixtureMiniature, unitId } });
}

async function main() {
  await seedBaseData();

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
