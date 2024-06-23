import { Container } from "@chakra-ui/react";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Set up a new game" },
    {
      name: "description",
      content:
        "Set up a new game of Wargame by Mail. Place terrain on the table, and invite a friend to play.",
    },
  ];
};

export default function NewGame() {
  return <Container></Container>;
}
