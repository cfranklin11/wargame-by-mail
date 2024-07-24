import { Container, Input, Button } from "@chakra-ui/react";
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
import FormField from "~/components/FormField";
import PageHeading from "~/components/PageHeading";

interface FormErrors {
  email?: string[];
  password?: string[];
  username?: string[];
}
const EMPTY_FORM_ERRORS: FormErrors = {};

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

  try {
    const user = await db.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    const session = await getSession(request.headers.get("cookie"));
    session.set(authenticator.sessionKey, user);
    const headers = new Headers({ "Set-Cookie": await commitSession(session) });
    return redirect("/account", { headers });
  } catch (error) {
    if (error instanceof ZodError) {
      const session = await getSession(request.headers.get("cookie"));
      const errors = error.issues.reduce((aggValue, currValue) => {
        const key = currValue.path[0] as keyof FormErrors;
        invariant(typeof key === "string", "validation error must have a key");

        return {
          ...aggValue,
          [key]: [...(aggValue[key] || []), currValue.message],
        };
      }, EMPTY_FORM_ERRORS);
      return json(
        { errors },
        {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        },
      );
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
        <Button width="100%" type="submit">
          Create account
        </Button>
      </Form>
    </Container>
  );
}
