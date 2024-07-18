import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { MetaFunction, ActionFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { authenticator } from "~/.server/auth";
import { commitSession, getSession } from "~/.server/session";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Sign up" },
    {
      name: "description",
      content: "Sign up for a new account at Wargame by Mail.",
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.authenticate("form", request);

  const session = await getSession(request.headers.get("cookie"));
  session.set(authenticator.sessionKey, user);
  const headers = new Headers({ "Set-Cookie": await commitSession(session) });

  return redirect(`/users/${user.id}`, { headers });
};

export default function SignupPage() {
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
        <FormControl isRequired marginTop="1rem" marginBottom="1rem">
          <FormLabel>Username</FormLabel>
          <Input type="text" name="username" />
        </FormControl>
        <FormControl isRequired marginTop="1rem" marginBottom="1rem">
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" />
        </FormControl>
        <FormControl isRequired marginTop="1rem" marginBottom="1rem">
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" />
        </FormControl>
        <Button width="100%" type="submit">
          Create account
        </Button>
      </Form>
    </Container>
  );
}
