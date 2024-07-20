import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
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
    return redirect(`/users/${user.id}`, { headers });
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
      <Heading
        as="h1"
        size={{ base: "lg", lg: "2xl" }}
        margin="1rem"
        textAlign="center"
      >
        Sign up
      </Heading>
      <Form method="post">
        <FormControl
          isRequired
          marginTop="1rem"
          marginBottom="1rem"
          isInvalid={!!errors?.username}
        >
          <FormLabel>Username</FormLabel>
          <Input type="text" name="username" />
          {errors?.username?.map((message) => (
            <FormErrorMessage key={message}>{message}</FormErrorMessage>
          ))}
        </FormControl>
        <FormControl
          isRequired
          marginTop="1rem"
          marginBottom="1rem"
          isInvalid={!!errors?.email}
        >
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" />
          {errors?.email?.map((message) => (
            <FormErrorMessage key={message}>{message}</FormErrorMessage>
          ))}
        </FormControl>
        <FormControl
          isRequired
          marginTop="1rem"
          marginBottom="1rem"
          isInvalid={!!errors?.password}
        >
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" />
          {errors?.password?.map((message) => (
            <FormErrorMessage key={message}>{message}</FormErrorMessage>
          )) || (
            <FormHelperText>Must have at least 8 characters</FormHelperText>
          )}
        </FormControl>
        <Input type="hidden" name="signup" value="true" />
        <Button width="100%" type="submit">
          Create account
        </Button>
      </Form>
    </Container>
  );
}
