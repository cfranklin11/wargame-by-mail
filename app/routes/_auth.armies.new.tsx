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
import { ZodError } from "zod";
import db, { Army } from "~/.server/db";

import { Button, FormField, PageHeading } from "~/components";

type FormErrors = Partial<Record<keyof Army, string[]>>;

const SUBMIT_TYPES = ["save", "addUnits"];
const EMPTY_FORM_ERRORS: FormErrors = {};

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

  try {
    const army = await R.pipe(
      Object.fromEntries,
      R.omit(["submit"])<Army & { submit: string }>,
      R.objOf("data")<Army>,
      db.army.create,
    )(formData);

    if (submitType === "save") return json({ errors: EMPTY_FORM_ERRORS });

    if (submitType === "addUnits")
      return redirect(`/armies/${army.id}/units/new`);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.reduce((aggValue, currValue) => {
        const key = currValue.path[0] as keyof FormErrors;
        invariant(typeof key === "string");

        return {
          ...aggValue,
          [key]: [...(aggValue[key] || []), currValue.message],
        };
      }, EMPTY_FORM_ERRORS);
      return json({ errors });
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
