import { Box, Container, Heading, VStack } from "@chakra-ui/react";
import { MetaFunction } from "@remix-run/node";
import { ClientOnly } from "remix-utils/client-only";
import PageHeading from "~/components/PageHeading";

import Spinner from "~/components/Spinner";
import TableTop from "~/components/Tabletop";

const MIN_TABLE_HEIGHT = "55vh";

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
      <PageHeading>Play Game</PageHeading>
      <VStack>
        <ClientOnly fallback={<Spinner minHeight={MIN_TABLE_HEIGHT} />}>
          {() => <TableTop minHeight={MIN_TABLE_HEIGHT} />}
        </ClientOnly>
        <Box>Game Controls</Box>
      </VStack>
    </Container>
  );
}
