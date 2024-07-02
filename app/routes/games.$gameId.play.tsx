import { Box, Container, Heading, VStack } from "@chakra-ui/react";
import { MetaFunction } from "@remix-run/node";
import TableTop from "~/components/Tabletop";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Game on" },
    {
      name: "description",
      content: "Play your game. Roll your dice. Move your mice.",
    },
  ];
};

export default function Game() {
  return (
    <Container>
      <Heading
        as="h1"
        size={{ base: "lg", lg: "2xl" }}
        margin="1rem"
        textAlign="center"
      >
        Play Game
      </Heading>
      <VStack>
        <TableTop />
        <Box>Game Controls</Box>
      </VStack>
    </Container>
  );
}
