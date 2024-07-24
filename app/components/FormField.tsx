import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  isRequired?: boolean;
  label: string;
  helperText?: string;
  errors?: string[];
  children: ReactNode;
};

export default function FormField({
  isRequired = false,
  label,
  helperText = "",
  errors = [],
  children,
}: Props) {
  const isInvalid = errors.length > 0;

  return (
    <FormControl
      isRequired={isRequired}
      marginTop="1rem"
      marginBottom="1rem"
      isInvalid={isInvalid}
    >
      <FormLabel>{label}</FormLabel>
      {children}
      {errors.map((message) => (
        <FormErrorMessage key={message}>{message}</FormErrorMessage>
      ))}
      {!isInvalid && helperText ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
