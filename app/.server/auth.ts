import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import bcrypt from "bcryptjs";

import { sessionStorage } from "./session";
import db, { User } from "./db";

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const password = form.get("password");
    const email = form.get("email");

    invariant(typeof password === "string", "password must be a string");
    invariant(password.length > 0, "password must not be empty");

    invariant(typeof email === "string", "email must be a string");
    invariant(email.length > 0, "email must not be empty");

    const user = await db.user.findFirstOrThrow({ where: { email } });

    const storedHashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(
      password,
      storedHashedPassword,
    );
    invariant(isPasswordValid, "password is incorrect");

    return user;
  }),
);
