import {
  Avatar,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { authenticator } from "~/.server/auth";
import type { User } from "~/.server/db";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  invariant(typeof params.userId === "string");
  if (user.id !== parseInt(params.userId)) {
    return redirect(`/users/${user.id}`);
  }

  return json({ user });
};

export default function UserPage() {
  const {
    user: { username, id },
  } = useLoaderData<{ user: User }>();

  return (
    <>
      <Box width="100%">
        <HStack justifyContent="end">
          <Menu>
            <MenuButton margin="1rem">
              <Avatar name={username}></Avatar>
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Link to={`/users/${id}`}>Account page</Link>
              </MenuItem>
              <Form method="post" action="/logout">
                <MenuItem type="submit">Log out</MenuItem>
              </Form>
            </MenuList>
          </Menu>
        </HStack>
      </Box>
      <Container>
        <Heading
          as="h1"
          size={{ base: "lg", lg: "2xl" }}
          margin="1rem"
          textAlign="center"
        >
          {username}
        </Heading>
        <Link to={"/games/new"}>
          <Button width="100%">Start a game</Button>
        </Link>
      </Container>
    </>
  );
}
