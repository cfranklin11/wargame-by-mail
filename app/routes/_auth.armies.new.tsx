import { Input, Textarea } from "@chakra-ui/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  Link,
  MetaFunction,
  redirect,
  useActionData,
} from "@remix-run/react";
import * as R from "ramda";
import invariant from "tiny-invariant";
import db, { Army } from "~/.server/db";

import { Button, FormField, PageHeading } from "~/components";

const SUBMIT_TYPES = ["save", "addUnits"];

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Build a new army" },
    {
      name: "description",
      content: "Build a new army for use in your games.",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submitType = formData.get("submit");

  invariant(
    typeof submitType === "string" && SUBMIT_TYPES.includes(submitType),
  );

  const army = await R.pipe(
    Object.fromEntries,
    R.omit(["submit"])<Army & { submit: string }>,
    R.objOf("data")<Army>,
    db.army.create,
  )(formData);

  if (submitType === "save") return json({ army });

  if (submitType === "addUnits")
    return redirect(`/armies/${army.id}/units/new`);
}

export default function NewArmyPage() {
  const { army } = useActionData<typeof action>() || {};

  return (
    <>
      <PageHeading>Build a new army</PageHeading>
      <Form method="post">
        <FormField isRequired label="Name">
          <Input type="text" name="name" defaultValue={army?.name} />
        </FormField>
        <FormField isRequired label="Game system">
          <Input
            type="text"
            name="gameSystem"
            defaultValue={army?.gameSystem}
          />
        </FormField>
        <FormField isRequired label="Faction">
          <Input type="text" name="faction" defaultValue={army?.faction} />
        </FormField>
        <FormField label="Description">
          <Textarea name="description" defaultValue={army?.description} />
        </FormField>
        <Button type="submit" value="save" name="submit">
          Save
        </Button>
        <Button type="submit" value="addUnits" name="submit">
          Add units
        </Button>
      </Form>
      <Link to="/account">
        <Button>Back to account</Button>
      </Link>
    </>
  );
}
