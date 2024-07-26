import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  Link,
  MetaFunction,
  Params,
  redirect,
  useLoaderData,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import * as R from "ramda";
import db, { Miniature } from "~/.server/db";
import { Button, FormField, PageHeading } from "~/components";
import { Input, Textarea } from "@chakra-ui/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Add a model to your unit" },
    {
      name: "description",
      content: "Add one or more models to your unit.",
    },
  ];
};

const fetchUnit = (params: Params<string>) =>
  R.pipe(
    R.prop("unitId"),
    R.tap((unitId) => invariant(typeof unitId === "string")),
    parseInt,
    R.objOf("id"),
    R.objOf("where"),
    db.unit.findUniqueOrThrow,
    R.andThen(R.objOf("unit")),
  )(params);

export function loader({ params }: LoaderFunctionArgs) {
  return R.pipe(fetchUnit, R.andThen(json))(params);
}

export async function action({ request }: ActionFunctionArgs) {
  return R.pipe(
    R.invoker(0, "formData"),
    R.andThen(R.invoker(0, "entries")),
    R.andThen(
      R.map(([key, value]) => [
        key,
        Number.isNaN(parseInt(value)) ? value : parseInt(value),
      ]),
    ),
    R.andThen(Object.fromEntries),
    R.andThen(R.objOf("data")<Miniature>),
    R.andThen(db.miniature.create),
    R.andThen(R.objOf("miniature")<Miniature>),
    R.andThen(json),
  )(request);
}

export default function NewUnitPage() {
  const { unit } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeading>Add a model to {unit.name}</PageHeading>
      <Form method="post">
        <FormField isRequired label="Name">
          <Input type="text" name="name" />
        </FormField>
        <FormField label="Stats">
          <Textarea name="stats" />
        </FormField>
        <FormField label="Gear">
          <Textarea name="gear" />
        </FormField>
        <FormField label="Notes">
          <Textarea name="notes" />
        </FormField>
        <FormField isRequired label="How many?">
          <Input type="number" name="count" min={1} step={1} defaultValue={1} />
        </FormField>
        <Input type="hidden" name="unitId" value={unit.id} />
        <Button type="submit">Save</Button>
      </Form>
      <Link to={`/armies/${unit.armyId}/units/new`}>
        <Button>Back to unit</Button>
      </Link>
    </>
  );
}
