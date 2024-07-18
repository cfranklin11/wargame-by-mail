import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import bcrypt from "bcryptjs";

import { sessionStorage } from "./session";
import db, { User } from "./db";

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("username");
    const password = form.get("password");
    const email = form.get("email");

    invariant(typeof username === "string", "username must be a string");
    invariant(username.length > 0, "username must not be empty");

    invariant(typeof password === "string", "password must be a string");
    invariant(password.length > 0, "password must not be empty");

    invariant(typeof email === "string", "email must be a string");
    invariant(email.length > 0, "email must not be empty");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return user;
  }),
);
