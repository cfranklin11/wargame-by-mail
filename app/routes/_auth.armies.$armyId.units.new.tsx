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
import * as R from "ramda";
import { ZodError } from "zod";

import db, { BaseShape } from "~/.server/db";
import { Button, FormField, PageHeading } from "~/components";
import { Input, Select, Textarea } from "@chakra-ui/react";
import { convertToModelData, formatValidationErrors } from "~/utils/form";
import { Unit } from "~/models/unit";
import { Army } from "~/models/army";
import { idFromParams } from "~/utils/request";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Add a unit to your army" },
    {
      name: "description",
      content: "Add a unit with one or more models to your army.",
    },
  ];
};

const fetchArmy = (params: Params<string>) =>
  R.pipe(
    idFromParams("armyId"),
    R.objOf("id"),
    R.objOf("where"),
    db.army.findUniqueOrThrow,
    R.andThen(R.objOf("army")),
  )(params);

const fetchBaseShapes = () =>
  R.pipe(db.baseShape.findMany, R.andThen(R.objOf("baseShapes")))();

export function loader({ params }: LoaderFunctionArgs) {
  return R.pipe(
    (params) => Promise.all([fetchArmy(params), fetchBaseShapes()]),
    R.andThen(R.mergeAll<{ army: Army }, [{ baseShapes: BaseShape[] }]>),
    R.andThen(json),
  )(params);
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await R.pipe(
      R.invoker(0, "formData"),
      R.andThen(convertToModelData),
      R.andThen(R.objOf("data")<Unit>),
      R.andThen(db.unit.create),
      R.andThen((unit) =>
        redirect(`/armies/${unit.armyId}/units/${unit.id}/edit`),
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
  const { army, baseShapes } = useLoaderData<typeof loader>();
  const { errors } = useActionData<typeof action>() || {};

  return (
    <>
      <PageHeading>Add a unit to {army.name}</PageHeading>
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
        <FormField isRequired label="Base shape">
          <Select placeholder="Select models' base shape" name="baseShapeId">
            {baseShapes.map(({ name, id }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField
          isRequired
          label="Base length (mm)"
          errors={errors?.baseLength}
        >
          <Input
            type="number"
            name="baseLength"
            min={1}
            step={1}
            defaultValue={25}
          />
        </FormField>
        <FormField
          isRequired
          label="Base width (mm)"
          errors={errors?.baseWidth}
        >
          <Input
            type="number"
            name="baseWidth"
            min={1}
            step={1}
            defaultValue={25}
          />
        </FormField>
        <FormField isRequired label="Model color" errors={errors?.color}>
          <Input type="color" name="color" />
        </FormField>
        <Input type="hidden" name="armyId" value={army.id} />
        <Button type="submit">Save</Button>
      </Form>
      <Link to={`/armies/${army.id}/edit`}>
        <Button>Back to army</Button>
      </Link>
    </>
  );
}
