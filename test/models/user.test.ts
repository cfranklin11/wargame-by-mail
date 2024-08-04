import * as R from "ramda";
import { ZodError } from "zod";
import { PrismaClient } from "@prisma/client";

import { userInputFactory, userFactory } from "../factories/user";
import * as userModel from "../../app/models/user";

describe("validate", () => {
  const prisma = new PrismaClient();
  const findUniqueSpy = jest.spyOn(prisma.user, "findUnique");
  const validUserInput = userInputFactory.build();

  describe("when all attributes are valid", () => {
    const user = validUserInput;

    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      findUniqueSpy.mockReturnValue(Promise.resolve(null) as any);
    });

    it("returns the user object", async () => {
      expect(await userModel.validate(prisma, user)).toEqual(user);
    });
  });

  describe("when short-text attributes have too many characters", () => {
    const tooLongString = R.repeat("yo", 130).join();
    const user = {
      ...validUserInput,
      username: tooLongString,
      password: tooLongString,
      email: tooLongString,
    };

    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      findUniqueSpy.mockReturnValue(Promise.resolve(null) as any);
    });

    it("throws a validation error", async () => {
      expect.assertions(1);

      try {
        await userModel.validate(prisma, user);
      } catch (error) {
        expect((error as ZodError).issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ["username"], code: "too_big" }),
            expect.objectContaining({ path: ["password"], code: "too_big" }),
            expect.objectContaining({ path: ["email"], code: "too_big" }),
          ]),
        );
      }
    });
  });

  describe("when the password is too short", () => {
    const user = {
      ...validUserInput,
      password: "yo",
    };

    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      findUniqueSpy.mockReturnValue(Promise.resolve(null) as any);
    });

    it("throws a validation error", async () => {
      expect.assertions(1);

      try {
        await userModel.validate(prisma, user);
      } catch (error) {
        expect((error as ZodError).issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ["password"], code: "too_small" }),
          ]),
        );
      }
    });
  });

  describe("when the email is not valid", () => {
    const user = {
      ...validUserInput,
      email: "definitelynotanemail",
    };

    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      findUniqueSpy.mockReturnValue(Promise.resolve(null) as any);
    });

    it("throws a validation error", async () => {
      expect.assertions(1);

      try {
        await userModel.validate(prisma, user);
      } catch (error) {
        expect((error as ZodError).issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ["email"],
              code: "invalid_string",
            }),
          ]),
        );
      }
    });
  });

  describe("when the email or username already exists", () => {
    const user = validUserInput;

    beforeEach(() => {
      findUniqueSpy.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Promise.resolve(userFactory.build()) as any,
      );
    });

    it("throws a validation error", async () => {
      expect.assertions(1);

      try {
        await userModel.validate(prisma, user);
      } catch (error) {
        expect((error as ZodError).issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ["email"], code: "custom" }),
            expect.objectContaining({ path: ["username"], code: "custom" }),
          ]),
        );
      }
    });
  });
});
