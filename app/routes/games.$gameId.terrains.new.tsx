import {
  Container,
  Input,
  Box,
  VStack,
  Select,
  Textarea,
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
import {
  Spinner,
  TableTop,
  PageHeading,
  FormField,
  Button,
  RecordTable,
} from "~/components";
import { convertToModelData } from "~/utils/form";

const INCHES_PER_FOOT = 12;
const BOARD_WIDTH_IN = 6 * INCHES_PER_FOOT;
const BOARD_HEIGHT_IN = 4 * INCHES_PER_FOOT;
const MIN_TABLE_HEIGHT = "55vh";
const TABLE_LABELS = { name: "Name" };

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
    R.andThen(convertToModelData),
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
            <Button type="submit">Add terrain</Button>
          </Form>
          {terrains.length === 0 ? null : (
            <>
              <Divider
                marginTop="2rem"
                marginBottom="1rem"
                borderBottomColor="gray"
                borderBottomWidth="0.125rem"
              />
              <RecordTable
                columns={["name"]}
                records={terrains}
                labelMap={TABLE_LABELS}
              />
            </>
          )}
          <Link to={`/games/${gameId}/play`}>
            <Button marginTop="1rem" marginBottom="1rem">
              Start game
            </Button>
          </Link>
        </Box>
      </VStack>
    </Container>
  );
}
