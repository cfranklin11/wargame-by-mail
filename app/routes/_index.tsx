import { Heading, Text, Container, Box, VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Button } from "~/components";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail" },
    {
      name: "description",
      content:
        "An online miniature wargame simulator that lets you play with friends asynchronously.",
    },
  ];
};

export default function Index() {
  return (
    <Container centerContent textAlign="center" maxWidth="none">
      <VStack spacing="4rem" marginTop="12rem">
        <Box>
          <Heading as="h1" size="4xl" margin="1rem">
            Wargame by Mail
          </Heading>
          <Text>
            An online miniature wargame simulator that lets you play with
            friends asynchronously.
          </Text>
        </Box>
        <Box width="100%">
          <Link to={"/login"}>
            <Button marginBottom="1rem">Log in</Button>
          </Link>
          <Link to={"/signup"}>
            <Button>Sign up</Button>
          </Link>
        </Box>
      </VStack>
    </Container>
  );
}
