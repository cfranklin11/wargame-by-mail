import {
  Heading,
  Text,
  Container,
  Box,
  VStack,
  Button,
} from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

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
        <Link to={"/signup"}>
          <Button width="100%">Sign up</Button>
        </Link>
      </VStack>
    </Container>
  );
}
