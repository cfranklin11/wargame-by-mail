import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";

const { NODE_ENV, SECRET } = process.env;

invariant(SECRET, "SECRET env var must be defined");

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [SECRET], // replace this with an actual secret
    secure: NODE_ENV === "production", // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = sessionStorage;
