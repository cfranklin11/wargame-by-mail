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
import { ZodError } from "zod";

import db, { BaseShape } from "~/.server/db";
import { Button, FormField, PageHeading } from "~/components";
import { Input, Select, Textarea } from "@chakra-ui/react";
import { convertToModelData, formatValidationErrors } from "~/utils/form";
import { Unit, find as findUnit } from "~/models/unit";
import { Army, find as findArmy } from "~/models/army";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Edit a unit in your army" },
    {
      name: "description",
      content: "Edit the characteristics of a unit in your army.",
    },
  ];
};

const fetchArmy = (params: Params<string>) =>
  R.pipe(
    R.prop("armyId"),
    R.tap((armyId) => invariant(typeof armyId === "string")),
    parseInt,
    findArmy,
    R.andThen(R.objOf("army")),
  )(params);

const fetchUnit = (params: Params<string>) =>
  R.pipe(
    R.prop("unitId"),
    R.tap((unitId) => invariant(typeof unitId === "string")),
    parseInt,
    findUnit,
    R.andThen(R.objOf("unit")),
  )(params);

const fetchBaseShapes = () =>
  R.pipe(db.baseShape.findMany, R.andThen(R.objOf("baseShapes")))();

const prepareUpdateParams = (unit: Unit) => ({
  where: { id: unit.id },
  data: unit,
});

export function loader({ params }: LoaderFunctionArgs) {
  return R.pipe(
    (params) =>
      Promise.all([fetchArmy(params), fetchBaseShapes(), fetchUnit(params)]),
    R.andThen(
      R.mergeAll<{ army: Army }, [{ baseShapes: BaseShape[] }, { unit: Unit }]>,
    ),
    R.andThen(json),
  )(params);
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    await R.pipe(
      R.invoker(0, "formData"),
      R.andThen(convertToModelData),
      R.andThen(prepareUpdateParams),
      R.andThen(db.unit.update),
    )(request);
  } catch (error) {
    if (error instanceof ZodError) {
      return R.pipe(formatValidationErrors, R.objOf("errors"), json)(error);
    }

    throw error;
  }
}

export default function NewUnitPage() {
  const { army, baseShapes, unit } = useLoaderData<typeof loader>();
  const { errors } = useActionData<typeof action>() || {};

  return (
    <>
      <PageHeading>Edit {unit.name}</PageHeading>
      <Form method="post" reloadDocument>
        <FormField isRequired label="Name" errors={errors?.name}>
          <Input type="text" name="name" defaultValue={unit.name} />
        </FormField>
        <FormField label="Stats" errors={errors?.stats}>
          <Textarea name="stats" defaultValue={unit.stats} />
        </FormField>
        <FormField label="Gear" errors={errors?.gear}>
          <Textarea name="gear" defaultValue={unit.gear} />
        </FormField>
        <FormField label="Notes" errors={errors?.notes}>
          <Textarea name="notes" defaultValue={unit.notes} />
        </FormField>
        <FormField isRequired label="Base shape">
          <Select name="baseShapeId">
            {baseShapes.map(({ name, id }) => (
              <option key={id} value={id} selected={id === unit.baseShapeId}>
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
            defaultValue={unit.baseLength}
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
            defaultValue={unit.baseWidth}
          />
        </FormField>
        <FormField isRequired label="Model color" errors={errors?.color}>
          <Input type="color" name="color" defaultValue={unit.color} />
        </FormField>
        <Input type="hidden" name="armyId" value={army.id} />
        <Input type="hidden" name="unitId" value={unit.id} />
        <Button type="submit" value="save" name="submit">
          Save
        </Button>
      </Form>
      <Link to={`/units/${unit.id}/miniatures/new`}>
        <Button>Add models</Button>
      </Link>
      <Link to={`/armies/${army.id}/edit`}>
        <Button>Back to army</Button>
      </Link>
    </>
  );
}
