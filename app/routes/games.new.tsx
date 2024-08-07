import { Container, Input, Textarea } from "@chakra-ui/react";
import { MetaFunction, ActionFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import * as R from "ramda";

import db from "../.server/db";
import { PageHeading, FormField, Button } from "~/components";
import { convertToModelData } from "~/utils/form";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Set up a new game" },
    {
      name: "description",
      content: "Set up a new game of Wargame by Mail.",
    },
  ];
};

export const action: ActionFunction = async ({ request }) =>
  R.pipe(
    R.invoker(0, "formData"),
    R.andThen(convertToModelData),
    R.andThen(R.objOf("data")),
    R.andThen(db.game.create),
    R.andThen(R.prop("id")),
    R.andThen((id) => redirect(`/games/${id}/terrains/new`)),
  )(request);

function NewGamePage() {
  return (
    <Container>
      <PageHeading>Set up a new game</PageHeading>
      <Form method="post">
        <FormField isRequired label="Name">
          <Input type="text" name="name" />
        </FormField>
        <FormField label="Description">
          <Textarea name="description" />
        </FormField>
        <Button type="submit">Create game</Button>
      </Form>
    </Container>
  );
}

export default function NewGame() {
  return <NewGamePage />;
}
