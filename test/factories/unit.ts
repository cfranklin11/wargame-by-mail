import { Factory } from "fishery";

import { Unit } from "../../app/models/unit";
import { faker } from "@faker-js/faker";

export const unitInputFactory = Factory.define<
  Omit<Unit, "id" | "updatedAt" | "createdAt" | "baseShapeId" | "armyId">
>(() => {
  return {
    name: faker.company.name(),
    stats: faker.lorem.paragraph(),
    gear: faker.lorem.paragraph(),
    notes: faker.lorem.paragraph(),
    color: faker.color.rgb(),
    baseLength: faker.number.int({ min: 1 }),
    baseWidth: faker.number.int({ min: 1 }),
  };
});

export const unitFactory = Factory.define<Unit>(({ sequence }) => {
  const createdAt = faker.date.past();
  return {
    id: sequence,
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
    baseShapeId: faker.number.int({ min: 1 }),
    armyId: faker.number.int({ min: 1 }),
    ...unitInputFactory.build(),
  };
});
