import { Box } from "@chakra-ui/react";

interface TableTopProps {
  minHeight: string;
}

export default function TableTop({ minHeight }: TableTopProps) {
  return <Box minHeight={minHeight}>Tabletop Placeholder</Box>;
}
