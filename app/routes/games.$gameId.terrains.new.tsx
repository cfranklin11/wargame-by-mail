import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Container,
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
import FormField from "~/components/FormField";

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
            <FormField isRequired label="Name">
              <Input type="text" name="name" />
            </FormField>
            <FormField isRequired label="Type">
              <Select placeholder="Select terrain type" name="typeId">
                {terrainTypes.map(({ name, id }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField isRequired label="Shape">
              <Select placeholder="Select terrain shape" name="shapeId">
                {terrainShapes.map(({ name, id }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField isRequired label="Width (in)">
              <Input
                type="number"
                name="width"
                min={1}
                step={1}
                defaultValue={1}
              />
            </FormField>
            <FormField isRequired label="Height (in)">
              <Input
                type="number"
                name="height"
                min={1}
                step={1}
                defaultValue={1}
              />
            </FormField>
            <FormField isRequired label="Angle (degrees)">
              <Input type="number" name="angle" step={1} defaultValue={0} />
            </FormField>
            <FormField isRequired label="Center x-coordinate (in)">
              <Input
                type="number"
                name="centerX"
                step={1}
                defaultValue={0}
                min={0}
                max={BOARD_WIDTH_IN}
              />
            </FormField>
            <FormField isRequired label="Center y-coordinate (in)">
              <Input
                type="number"
                name="centerY"
                step={1}
                defaultValue={0}
                min={0}
                max={BOARD_HEIGHT_IN}
              />
            </FormField>
            <FormField label="Notes">
              <Textarea name="notes" />
            </FormField>
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
