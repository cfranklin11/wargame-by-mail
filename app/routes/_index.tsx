import { Heading, Text, Container, Box, VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import styled from "@emotion/styled";
import { ReactNode } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail" },
    {
      name: "description",
      content:
        "An online miniature wargame simulator that lets you play with friends asynchronously.",
    },
  ];
};

// Remix's Link component really doesn't play nice with styled components,
// so this is what I came up with to work around it.
const ButtonLinkStyles = styled.div`
  a {
    padding: 1rem;
    background-color: darkgray;
    color: white;
    text-decoration: none;
    :hover,
    :focus {
      background-color: gray;
    }
  }
`;
function ButtonLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <ButtonLinkStyles>
      <Link to={to}>{children}</Link>
    </ButtonLinkStyles>
  );
}

export default function Index() {
  return (
    <Container centerContent textAlign="center" maxWidth="none">
      <VStack spacing="4rem" marginTop="12rem">
        <Box>
          <Heading as="h1" size="4xl" margin="1rem">
            Wargame by Mail
          </Heading>
          <Text>
            An online miniature wargame simulator that lets you play with
            friends asynchronously.
          </Text>
        </Box>
        <ButtonLink to="/games/new">Start new game</ButtonLink>
      </VStack>
    </Container>
  );
}
