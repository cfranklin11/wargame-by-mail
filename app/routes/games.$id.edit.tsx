import { Container, Heading } from "@chakra-ui/react";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Edit game" },
    {
      name: "description",
      content: "Edit a game of Wargame by Mail. Add terrain if you want.",
    },
  ];
};

export default function EditGame() {
  return (
    <Container>
      <Heading
        as="h1"
        size={{ base: "lg", lg: "2xl" }}
        margin="1rem"
        textAlign="center"
      >
        Edit your game
      </Heading>
    </Container>
  );
}
