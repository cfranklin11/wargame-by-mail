import {
  Avatar,
  Box,
  Container,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";

import { authenticator } from "~/.server/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return json({ user });
}

export default function AuthenticatedPage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <Box width="100%">
        <HStack justifyContent="end">
          <Menu>
            <MenuButton margin="1rem">
              <Avatar name={user.username} />
            </MenuButton>
            <MenuList>
              <MenuItem>
                <Link to={`/users/${user.id}`}>Account page</Link>
              </MenuItem>
              <Form method="post" action="/logout">
                <MenuItem type="submit">Log out</MenuItem>
              </Form>
            </MenuList>
          </Menu>
        </HStack>
      </Box>
      <Container>
        <Outlet context={{ user }} />
      </Container>
    </>
  );
}
