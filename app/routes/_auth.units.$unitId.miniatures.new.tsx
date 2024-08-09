import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  Link,
  MetaFunction,
  Params,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import * as R from "ramda";
import { Input, Textarea } from "@chakra-ui/react";
import { ZodError } from "zod";

import db from "~/.server/db";
import { Button, FormField, PageHeading } from "~/components";
import { convertToModelData, formatValidationErrors } from "~/utils/form";
import { Miniature } from "~/models/miniature";
import { findUnit } from "~/models/unit";

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
    findUnit,
    R.andThen(R.objOf("unit")),
  )(params);

export function loader({ params }: LoaderFunctionArgs) {
  return R.pipe(fetchUnit, R.andThen(json))(params);
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await R.pipe(
      R.invoker(0, "formData"),
      R.andThen(convertToModelData),
      R.andThen(R.objOf("data")<Miniature>),
      R.andThen(db.miniature.create),
      R.andThen((miniature) =>
        redirect(`/units/${miniature.unitId}/miniatures/${miniature.id}/edit`),
      ),
    )(request);
  } catch (error) {
    if (error instanceof ZodError) {
      return R.pipe(formatValidationErrors, R.objOf("errors"), json)(error);
    }

    throw error;
  }
}

export default function NewUnitPage() {
  const { unit } = useLoaderData<typeof loader>();
  const { errors } = useActionData<typeof action>() || {};

  return (
    <>
      <PageHeading>Add a model to {unit.name}</PageHeading>
      <Form method="post">
        <FormField isRequired label="Name" errors={errors?.name}>
          <Input type="text" name="name" />
        </FormField>
        <FormField label="Stats" errors={errors?.stats}>
          <Textarea name="stats" />
        </FormField>
        <FormField label="Gear" errors={errors?.gear}>
          <Textarea name="gear" />
        </FormField>
        <FormField label="Notes" errors={errors?.notes}>
          <Textarea name="notes" />
        </FormField>
        <FormField isRequired label="How many?" errors={errors?.count}>
          <Input type="number" name="count" min={1} step={1} defaultValue={1} />
        </FormField>
        <Input type="hidden" name="unitId" value={unit.id} />
        <Button type="submit">Save</Button>
      </Form>
      <Link to={`/armies/${unit.armyId}/units/${unit.id}/edit`}>
        <Button>Back to unit</Button>
      </Link>
    </>
  );
}
