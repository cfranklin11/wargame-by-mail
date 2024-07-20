import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  MetaFunction,
  redirect,
  json,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";

import { authenticator } from "~/.server/auth";
import { commitSession, getSession } from "~/.server/session";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Log in" },
    {
      name: "description",
      content: "Log into your account at Wargame by Mail.",
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const user = await authenticator.authenticate("form", request, {
      throwOnError: true,
    });
    const session = await getSession(request.headers.get("cookie"));
    session.set(authenticator.sessionKey, user);
    const headers = new Headers({ "Set-Cookie": await commitSession(session) });
    return redirect(`/users/${user.id}`, { headers });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      const session = await getSession(request.headers.get("cookie"));

      return json(
        { error: "Either the email or password are incorrect" },
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

export default function LoginPage() {
  const { error } = useActionData<typeof action>() || {};

  return (
    <Container>
      <Heading
        as="h1"
        size={{ base: "lg", lg: "2xl" }}
        margin="1rem"
        textAlign="center"
      >
        Log in
      </Heading>
      <Form method="post">
        <FormControl
          isRequired
          marginTop="1rem"
          marginBottom="1rem"
          isInvalid={!!error}
        >
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" />
        </FormControl>
        <FormControl
          isRequired
          marginTop="1rem"
          marginBottom="1rem"
          isInvalid={!!error}
        >
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
        <Button width="100%" type="submit">
          Log in
        </Button>
      </Form>
    </Container>
  );
}
