import { Factory } from "fishery";

import { Miniature } from "../../app/.server/db";
import { faker } from "@faker-js/faker";

export const miniatureInputFactory = Factory.define<
  Omit<Miniature, "id" | "updatedAt" | "createdAt" | "unitId">
>(() => {
  return {
    name: faker.company.name(),
    stats: faker.lorem.paragraph(),
    gear: faker.lorem.paragraph(),
    notes: faker.lorem.paragraph(),
    count: faker.number.int(),
  };
});

export const miniatureFactory = Factory.define<Miniature>(({ sequence }) => {
  const createdAt = faker.date.past();
  return {
    id: sequence,
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
    unitId: faker.number.int({ min: 1 }),
    ...miniatureInputFactory.build(),
  };
});
