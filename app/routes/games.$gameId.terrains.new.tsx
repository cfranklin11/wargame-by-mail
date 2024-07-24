import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  TableContainer,
  Table,
  Tr,
  Tbody,
  Td,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useParams } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import invariant from "tiny-invariant";
import * as R from "ramda";

import db from "~/.server/db";
import Spinner from "~/components/Spinner";
import TableTop from "~/components/Tabletop";
import PageHeading from "~/components/PageHeading";

const INCHES_PER_FOOT = 12;
const BOARD_WIDTH_IN = 6 * INCHES_PER_FOOT;
const BOARD_HEIGHT_IN = 4 * INCHES_PER_FOOT;
const MIN_TABLE_HEIGHT = "55vh";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Add terrain to your game" },
    {
      name: "description",
      content: "Add terrain to your game by placing it on the tabletop.",
    },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId } = params;

  invariant(gameId, "Expected gameId param");

  return json({
    terrains: await db.terrain.findMany({
      where: { gameId: parseInt(gameId) },
    }),
    terrainTypes: await db.terrainType.findMany(),
    terrainShapes: await db.terrainShape.findMany(),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await R.pipe(
    R.invoker(0, "formData"),
    R.andThen(R.invoker(0, "entries")),
    R.andThen(
      R.map(([key, value]) => [
        key,
        Number.isNaN(parseInt(value)) ? value : parseInt(value),
      ]),
    ),
    R.andThen(Object.fromEntries),
    R.andThen(R.objOf("data")),
    R.andThen(db.terrain.create),
  )(request);

  return null;
};

export default function NewTerrain() {
  const { gameId } = useParams();
  const { terrainTypes, terrainShapes, terrains } =
    useLoaderData<typeof loader>();

  if (!terrainTypes || !terrainShapes) return null;

  return (
    <Container>
      <PageHeading>Add terrain</PageHeading>
      <VStack>
        <ClientOnly fallback={<Spinner minHeight={MIN_TABLE_HEIGHT} />}>
          {() => <TableTop minHeight={MIN_TABLE_HEIGHT} />}
        </ClientOnly>
        <Box marginBottom="1rem" overflow="scroll" maxHeight="34vh">
          <Form method="post" reloadDocument>
            <FormControl isRequired marginTop="1rem" marginBottom="1rem">
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" />
            </FormControl>
            <FormControl isRequired marginTop="1rem" marginBottom="1rem">
              <FormLabel>Type</FormLabel>
              <Select placeholder="Select terrain type" name="typeId">
                {terrainTypes.map(({ name, id }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired marginTop="1rem" marginBottom="1rem">
              <FormLabel>Shape</FormLabel>
              <Select placeholder="Select terrain shape" name="shapeId">
                {terrainShapes.map(({ name, id }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
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
                name="centerX"
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
                name="centerY"
              />
            </FormControl>
            <FormControl marginTop="1rem" marginBottom="1rem">
              <FormLabel>Notes</FormLabel>
              <Textarea name="notes" />
            </FormControl>
            <Input name="gameId" type="hidden" value={gameId} />
            <Button width="100%" type="submit">
              Add terrain
            </Button>
          </Form>
          {terrains.length ? (
            <>
              <Divider
                marginTop="2rem"
                marginBottom="1rem"
                borderBottomColor="gray"
                borderBottomWidth="0.125rem"
              />
              <TableContainer>
                <Table>
                  <Tbody>
                    {terrains.map(({ id, name }) => (
                      <Tr key={id}>
                        <Td>{name}</Td>
                        <Td textAlign="right" paddingRight="0.25rem">
                          <IconButton
                            aria-label="Edit"
                            icon={<EditIcon boxSize={{ base: 6 }} />}
                            padding="1rem"
                          ></IconButton>
                        </Td>
                        <Td paddingLeft="0.25rem">
                          <IconButton
                            aria-label="Delete"
                            icon={<DeleteIcon boxSize={{ base: 6 }} />}
                            padding="1rem"
                          ></IconButton>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          ) : null}
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
