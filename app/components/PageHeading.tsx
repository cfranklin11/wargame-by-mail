import { Heading } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PageHeading({ children }: Props) {
  return (
    <Heading
      as="h1"
      size={{ base: "lg", lg: "2xl" }}
      margin="1rem"
      textAlign="center"
    >
      {children}
    </Heading>
  );
}
