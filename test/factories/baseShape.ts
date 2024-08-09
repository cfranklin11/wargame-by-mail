import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

import { BaseShape } from "../../app/.server/db";

export const baseShapeInputFactory = Factory.define<
  Omit<BaseShape, "id" | "updatedAt" | "createdAt">
>(() => {
  return {
    name: faker.company.name(),
  };
});

export const baseShapeFactory = Factory.define<BaseShape>(({ sequence }) => {
  const createdAt = faker.date.past();
  return {
    id: sequence,
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
    ...baseShapeInputFactory.build(),
  };
});
