import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  Link,
  MetaFunction,
  Params,
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
import { Unit } from "~/models/unit";

type FormErrors = Partial<Record<keyof Miniature, string[]>>;
const EMPTY_FORM_ERRORS: FormErrors = {};

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Edit models in your unit" },
    {
      name: "description",
      content: "Edit the characteristics of the models in your unit.",
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

const fetchMiniature = (params: Params<string>) =>
  R.pipe(
    R.prop("miniatureId"),
    R.tap((miniatureId) => invariant(typeof miniatureId === "string")),
    parseInt,
    R.objOf("id"),
    R.objOf("where"),
    db.miniature.findUniqueOrThrow,
    R.andThen(R.objOf("miniature")),
  )(params);

const prepareUpdateParams = (miniature: Miniature) => ({
  where: { id: miniature.id },
  data: miniature,
});

export function loader({ params }: LoaderFunctionArgs) {
  return R.pipe(
    (params) => Promise.all([fetchUnit(params), fetchMiniature(params)]),
    R.andThen(R.mergeAll<{ unit: Unit }, [{ miniature: Miniature }]>),
    R.andThen(json),
  )(params);
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    await R.pipe(
      R.invoker(0, "formData"),
      R.andThen(convertToModelData),
      R.andThen(prepareUpdateParams),
      R.andThen(db.miniature.update),
    )(request);
    return json({ errors: EMPTY_FORM_ERRORS });
  } catch (error) {
    if (error instanceof ZodError) {
      return R.pipe(formatValidationErrors, R.objOf("errors"), json)(error);
    }

    throw error;
  }
}

export default function NewUnitPage() {
  const { unit, miniature } = useLoaderData<typeof loader>();
  const { errors } = useActionData<typeof action>() || {};

  return (
    <>
      <PageHeading>Edit {miniature.name}</PageHeading>
      <Form method="post">
        <FormField isRequired label="Name" errors={errors?.name}>
          <Input type="text" name="name" defaultValue={miniature.name} />
        </FormField>
        <FormField label="Stats" errors={errors?.stats}>
          <Textarea name="stats" defaultValue={miniature.stats} />
        </FormField>
        <FormField label="Gear" errors={errors?.gear}>
          <Textarea name="gear" defaultValue={miniature.gear} />
        </FormField>
        <FormField label="Notes" errors={errors?.notes}>
          <Textarea name="notes" defaultValue={miniature.notes} />
        </FormField>
        <FormField isRequired label="How many?" errors={errors?.count}>
          <Input
            type="number"
            name="count"
            min={1}
            step={1}
            defaultValue={miniature.count}
          />
        </FormField>
        <Input type="hidden" name="unitId" value={unit.id} />
        <Input type="hidden" name="miniatureId" value={miniature.id} />
        <Button type="submit">Save</Button>
      </Form>
      <Link to={`/armies/${unit.armyId}/units/${unit.id}/edit`}>
        <Button>Back to unit</Button>
      </Link>
    </>
  );
}
