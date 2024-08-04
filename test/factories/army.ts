import { Factory } from "fishery";

import { Army } from "../../app/.server/db";
import { faker } from "@faker-js/faker";

export const armyInputFactory = Factory.define<
  Omit<Army, "id" | "updatedAt" | "createdAt">
>(() => {
  return {
    name: faker.company.name(),
    gameSystem: faker.commerce.department(),
    faction: faker.commerce.product(),
    description: faker.lorem.paragraph(),
  };
});

export const armyFactory = Factory.define<Army>(({ sequence }) => {
  const createdAt = faker.date.past();
  return {
    id: sequence,
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
    ...armyInputFactory.build(),
  };
});
