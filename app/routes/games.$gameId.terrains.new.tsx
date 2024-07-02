import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Box,
  VStack,
  Select,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { MetaFunction } from "@remix-run/node";
import { Form, Link, useParams } from "@remix-run/react";

import TableTop from "~/components/Tabletop";

const INCHES_PER_FOOT = 12;
const BOARD_WIDTH_IN = 6 * INCHES_PER_FOOT;
const BOARD_HEIGHT_IN = 4 * INCHES_PER_FOOT;

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Add terrain to your game" },
    {
      name: "description",
      content: "Add terrain to your game by placing it on the tabletop.",
    },
  ];
};

export default function NewTerrain() {
  const { gameId } = useParams();

  return (
    <Container>
      <Heading
        as="h1"
        size={{ base: "lg", lg: "2xl" }}
        margin="1rem"
        textAlign="center"
      >
        Add terrain
      </Heading>
      <VStack>
        <TableTop />
        <Box marginBottom="1rem" overflow="scroll" maxHeight="34vh">
          <Form>
            <FormControl isRequired marginTop="1rem" marginBottom="1rem">
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" />
            </FormControl>
            <FormControl isRequired marginTop="1rem" marginBottom="1rem">
              <FormLabel>Type</FormLabel>
              <Select placeholder="Select terrain type" name="type">
                <option>Woods</option>
                <option>Ruins</option>
                <option>Crater</option>
              </Select>
            </FormControl>
            <FormControl isRequired marginTop="1rem" marginBottom="1rem">
              <FormLabel>Shape</FormLabel>
              <Select placeholder="Select terrain shape" name="shape">
                <option>Rectangle</option>
                <option>Oval</option>
              </Select>
            </FormControl>
            <FormControl isRequired marginTop="1rem" marginBottom="1rem">
              <FormLabel>Width (in)</FormLabel>
              <Input
                type="number"
                min={1}
                step={1}
                defaultValue={1}
                name="width"
              />
            </FormControl>
            <FormControl isRequired marginTop="1rem" marginBottom="1rem">
              <FormLabel>Height (in)</FormLabel>
              <Input
                type="number"
                min={1}
                step={1}
                defaultValue={1}
                name="height"
              />
            </FormControl>
            <FormControl isRequired marginTop="1rem" marginBottom="1rem">
              <FormLabel>Angle (degrees)</FormLabel>
              <Input type="number" step={1} defaultValue={0} name="angle" />
            </FormControl>
            <FormControl isRequired marginTop="1rem" marginBottom="1rem">
              <FormLabel>Center x-coordinate (in)</FormLabel>
              <Input
                type="number"
                step={1}
                defaultValue={0}
                min={0}
                max={BOARD_WIDTH_IN}
                name="x"
              />
            </FormControl>
            <FormControl isRequired marginTop="1rem" marginBottom="1rem">
              <FormLabel>Center y-coordinate (in)</FormLabel>
              <Input
                type="number"
                step={1}
                defaultValue={0}
                min={0}
                max={BOARD_HEIGHT_IN}
                name="y"
              />
            </FormControl>
            <FormControl marginTop="1rem" marginBottom="1rem">
              <FormLabel>Notes</FormLabel>
              <Textarea name="notes" />
            </FormControl>
            <Button width="100%" type="submit">
              Add terrain
            </Button>
          </Form>
          <Link to={`/games/${gameId}/play`}>
            <Button width="100%" marginTop="1rem" marginBottom="1rem">
              Start game
            </Button>
          </Link>
        </Box>
      </VStack>
    </Container>
  );
}
