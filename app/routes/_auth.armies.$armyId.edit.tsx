import { Input, Textarea } from "@chakra-ui/react";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  MetaFunction,
  useActionData,
  Params,
  useLoaderData,
} from "@remix-run/react";
import * as R from "ramda";
import { ZodError } from "zod";
import invariant from "tiny-invariant";

import db from "~/.server/db";
import { Button, FormField, PageHeading, RecordTable } from "~/components";
import { convertToModelData, formatValidationErrors } from "~/utils/form";
import { Army, assertHasUnits, findArmy } from "~/models/army";

const TABLE_LABELS = {
  name: "Name",
};

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Edit your army" },
    {
      name: "description",
      content: "Edit the characteristics of your army.",
    },
  ];
};

const fetchArmy = (params: Params<string>) =>
  R.pipe(
    R.prop("armyId"),
    R.tap((armyId) => invariant(typeof armyId === "string")),
    parseInt,
    (armyId) => findArmy(armyId, { include: { units: true } }),
    R.andThen(R.tap(assertHasUnits)),
    R.andThen(R.objOf("army")),
  )(params);

const prepareUpdateParams = (army: Army) => ({
  where: { id: army.id },
  data: army,
});

export function loader({ params }: LoaderFunctionArgs) {
  return R.pipe(fetchArmy, R.andThen(json))(params);
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    await R.pipe(
      R.invoker(0, "formData"),
      R.andThen(convertToModelData),
      R.andThen(prepareUpdateParams),
      R.andThen(db.army.update),
    )(request);
  } catch (error) {
    if (error instanceof ZodError) {
      return R.pipe(formatValidationErrors, R.objOf("errors"), json)(error);
    }

    throw error;
  }
}

export default function EditArmyPage() {
  const { errors } = useActionData<typeof action>() || {};
  const { army } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeading>Edit {army.name}</PageHeading>
      <Form method="post" reloadDocument>
        <FormField isRequired label="Name" errors={errors?.name}>
          <Input type="text" name="name" defaultValue={army.name} />
        </FormField>
        <FormField isRequired label="Game system" errors={errors?.gameSystem}>
          <Input type="text" name="gameSystem" defaultValue={army.name} />
        </FormField>
        <FormField isRequired label="Faction" errors={errors?.faction}>
          <Input type="text" name="faction" defaultValue={army.name} />
        </FormField>
        <FormField label="Description" errors={errors?.description}>
          <Textarea name="description" defaultValue={army.name} />
        </FormField>
        <Input type="hidden" name="armyId" value={army.id} />
        <Button type="submit">Save</Button>
      </Form>
      {army.units.length === 0 ? null : (
        <RecordTable
          columns={["name"]}
          records={army.units}
          labelMap={TABLE_LABELS}
        />
      )}
      <Link to={`/armies/${army.id}/units/new`}>
        <Button>Add units</Button>
      </Link>
      <Link to="/armies/list">
        <Button>Back to armies</Button>
      </Link>
    </>
  );
}
