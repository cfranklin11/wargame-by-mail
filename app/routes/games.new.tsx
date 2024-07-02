import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Set up a new game" },
    {
      name: "description",
      content: "Set up a new game of Wargame by Mail.",
    },
  ];
};

function NewGamePage() {
  return (
    <Container>
      <Heading
        as="h1"
        size={{ base: "lg", lg: "2xl" }}
        margin="1rem"
        textAlign="center"
      >
        Set up a new game
      </Heading>
      <Form action="/games" method="post">
        <FormControl isRequired marginTop="1rem" marginBottom="1rem">
          <FormLabel>Name</FormLabel>
          <Input type="text" name="name" />
        </FormControl>
        <FormControl marginTop="1rem" marginBottom="1rem">
          <FormLabel>Description</FormLabel>
          <Textarea name="description" />
        </FormControl>
        <Button width="100%" type="submit">
          Create game
        </Button>
      </Form>
    </Container>
  );
}

export default function NewGame() {
  return <NewGamePage />;
}
