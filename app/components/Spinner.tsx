import { Flex, Spinner as ChakraSpinner } from "@chakra-ui/react";

interface SpinnerProps {
  minHeight: string;
}
export default function Spinner({ minHeight }: SpinnerProps) {
  return (
    <Flex width="100%" minHeight={minHeight} justify="center" align="center">
      <ChakraSpinner size="xl" />
    </Flex>
  );
}
