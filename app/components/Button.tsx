import { ButtonProps, Button as ChakraButton } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
} & ButtonProps;

export default function Button({ children, ...buttonProps }: Props) {
  return (
    <ChakraButton width="100%" marginBottom="1rem" {...buttonProps}>
      {children}
    </ChakraButton>
  );
}
