import {
  Container,
  Flex,
  Heading,
  Spinner as ChakraSpinner,
} from "@chakra-ui/react";
import { MetaFunction } from "@remix-run/node";
import { ClientOnly } from "remix-utils/client-only";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Set up a new game" },
    {
      name: "description",
      content:
        "Set up a new game of Wargame by Mail. Place terrain on the table, and invite a friend to play.",
    },
  ];
};

function Spinner() {
  return (
    <Flex width="100%" height="100vh" justify="center" align="center">
      <ChakraSpinner size="xl" />
    </Flex>
  );
}

function NewGamePage() {
  return (
    <Container>
      <Heading as="h1" size="2xl" margin="1rem">
        Set up a new game
      </Heading>
    </Container>
  );
}

export default function NewGame() {
  return (
    <ClientOnly fallback={<Spinner />}>{() => <NewGamePage />}</ClientOnly>
  );
}
