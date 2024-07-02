import { Box, Flex, VStack, Spinner as ChakraSpinner } from "@chakra-ui/react";
import { ClientOnly } from "remix-utils/client-only";

function Spinner({ minHeight }: { minHeight: string }) {
  return (
    <Flex width="100%" minHeight={minHeight} justify="center" align="center">
      <ChakraSpinner size="xl" />
    </Flex>
  );
}

export default function TableTop() {
  return (
    <ClientOnly fallback={<Spinner minHeight="55vh" />}>
      {() => (
        <Box minHeight="55vh">
          <VStack>Tabletop Placeholder</VStack>
        </Box>
      )}
    </ClientOnly>
  );
}
