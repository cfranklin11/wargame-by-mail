import { Container, Input } from "@chakra-ui/react";
import {
  MetaFunction,
  redirect,
  json,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { ZodError } from "zod";

import { authenticator } from "~/.server/auth";
import db from "~/.server/db";
import { commitSession, getSession } from "~/.server/session";
import { Button, FormField, PageHeading } from "~/components";
import { formatValidationErrors } from "~/utils/form";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Sign up" },
    {
      name: "description",
      content: "Sign up for a new account at Wargame by Mail.",
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const form = Object.fromEntries(formData);
  const { email, username, password } = form;
  invariant(typeof email === "string", "email must be a string");
  invariant(typeof password === "string", "password must be a string");
  invariant(typeof username === "string", "username must be a string");

  const session = await getSession(request.headers.get("cookie"));

  try {
    const user = await db.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    session.set(authenticator.sessionKey, user);
    const headers = new Headers({ "Set-Cookie": await commitSession(session) });
    return redirect("/account", { headers });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = formatValidationErrors(error);
      const headers = new Headers({
        "Set-Cookie": await commitSession(session),
      });

      return json({ errors }, { headers });
    }

    throw error;
  }
};

export default function SignupPage() {
  const { errors } = useActionData<typeof action>() || {};

  return (
    <Container>
      <PageHeading>Sign up</PageHeading>
      <Form method="post">
        <FormField isRequired label="Username" errors={errors?.username}>
          <Input type="text" name="username" />
        </FormField>
        <FormField isRequired label="Email" errors={errors?.email}>
          <Input type="email" name="email" />
        </FormField>
        <FormField
          isRequired
          label="Password"
          helperText="Must have at least 8 characters"
          errors={errors?.password}
        >
          <Input type="password" name="password" />
        </FormField>
        <Button type="submit">Create account</Button>
      </Form>
    </Container>
  );
}
