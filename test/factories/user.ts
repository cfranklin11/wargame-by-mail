import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

import { User } from "../../app/models/user";

export const userInputFactory = Factory.define<
  Omit<User, "id" | "updatedAt" | "createdAt">
>(() => {
  return {
    username: faker.company.name(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
  };
});

export const userFactory = Factory.define<User>(({ sequence }) => {
  const createdAt = faker.date.past();
  return {
    id: sequence,
    createdAt,
    updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
    ...userInputFactory.build(),
  };
});
