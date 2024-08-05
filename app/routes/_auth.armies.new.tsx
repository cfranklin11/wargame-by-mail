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
import { ZodError } from "zod";

import db from "~/.server/db";
import { Button, FormField, PageHeading } from "~/components";
import { formatValidationErrors } from "~/utils/form";
import { Army } from "~/models/army";

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
  try {
    return await R.pipe(
      R.invoker(0, "formData"),
      R.andThen(Object.fromEntries),
      R.andThen(R.objOf("data")<Army>),
      R.andThen(db.army.create),
      R.andThen((army) => redirect(`/armies/${army.id}/edit`)),
    )(request);
  } catch (error) {
    if (error instanceof ZodError) {
      return R.pipe(formatValidationErrors, R.objOf("errors"), json)(error);
    }

    throw error;
  }
}

export default function NewArmyPage() {
  const { errors } = useActionData<typeof action>() || {};

  return (
    <>
      <PageHeading>Build a new army</PageHeading>
      <Form method="post">
        <FormField isRequired label="Name" errors={errors?.name}>
          <Input type="text" name="name" />
        </FormField>
        <FormField isRequired label="Game system" errors={errors?.gameSystem}>
          <Input type="text" name="gameSystem" />
        </FormField>
        <FormField isRequired label="Faction" errors={errors?.faction}>
          <Input type="text" name="faction" />
        </FormField>
        <FormField label="Description" errors={errors?.description}>
          <Textarea name="description" />
        </FormField>
        <Button type="submit">Save</Button>
      </Form>
      <Link to="/account">
        <Button>Back to account</Button>
      </Link>
    </>
  );
}
