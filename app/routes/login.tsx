import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import { MetaFunction, json, ActionFunctionArgs } from "@remix-run/node";
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
    await authenticator.authenticate("form", request, {
      throwOnError: true,
      successRedirect: "/account",
    });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      const session = await getSession(request.headers.get("cookie"));

      return json(
        { errors: ["Either the email or password are incorrect"] },
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
  const response: Response | { errors: string[] } | undefined =
    useActionData<typeof action>();

  if (response instanceof Response) {
    throw response;
  }

  const { errors } = response || {};

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
          isInvalid={!!errors}
        >
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" />
        </FormControl>
        <FormControl
          isRequired
          marginTop="1rem"
          marginBottom="1rem"
          isInvalid={!!errors}
        >
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" />
          <FormErrorMessage>{errors}</FormErrorMessage>
        </FormControl>
        <Button width="100%" type="submit">
          Log in
        </Button>
      </Form>
    </Container>
  );
}
