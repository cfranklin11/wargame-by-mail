import {
  IconButton as ChakraIconButton,
  ComponentWithAs,
  IconProps,
} from "@chakra-ui/react";

interface Props {
  Icon: ComponentWithAs<"svg", IconProps>;
  label: string;
}
export default function IconButton({ Icon, label }: Props) {
  return (
    <ChakraIconButton
      aria-label={label}
      icon={<Icon boxSize={{ base: 6 }} />}
      padding="1rem"
    ></ChakraIconButton>
  );
}
