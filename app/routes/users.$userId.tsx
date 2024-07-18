import { Container, Heading } from "@chakra-ui/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { authenticator } from "~/.server/auth";
import type { User } from "~/.server/db";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  return json({ user });
};

export default function UserPage() {
  const {
    user: { username },
  } = useLoaderData<{ user: User }>();

  return (
    <Container>
      <Heading
        as="h1"
        size={{ base: "lg", lg: "2xl" }}
        margin="1rem"
        textAlign="center"
      >
        {username}
      </Heading>
    </Container>
  );
}
