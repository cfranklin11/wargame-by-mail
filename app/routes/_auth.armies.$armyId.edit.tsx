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

import db from "~/.server/db";
import {
  Button,
  FormField,
  IconButton,
  PageHeading,
  RecordTable,
} from "~/components";
import { convertToModelData, formatValidationErrors } from "~/utils/form";
import { Army, assertHasUnits, findArmy } from "~/models/army";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { idFromParams } from "~/utils/request";

const TABLE_COLUMNS = [{ key: "name", label: "Name" }];

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
    idFromParams("armyId"),
    (armyId) => findArmy(armyId, { include: { units: true } }),
    R.andThen(R.tap(assertHasUnits)),
    R.andThen(R.objOf("army")),
  )(params);

const prepareUpdateParams = ({ id, ...data }: Army) => ({
  where: { id },
  data,
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

    return null;
  } catch (error) {
    if (error instanceof ZodError) {
      return R.pipe(formatValidationErrors, R.objOf("errors"), json)(error);
    }

    throw error;
  }
}

const defineEditButton = (armyId: number) => {
  const EditButton = (unitId: number) => (
    <Link to={`/armies/${armyId}/units/${unitId}/edit`}>
      <IconButton label="Edit" Icon={EditIcon}></IconButton>
    </Link>
  );
  return EditButton;
};
const defineDeleteButton = (armyId: number) => {
  const DeleteButton = (unitId: number) => (
    <Link to={`/armies/${armyId}/units/${unitId}/delete`}>
      <IconButton label="Delete" Icon={DeleteIcon}></IconButton>
    </Link>
  );
  return DeleteButton;
};

export default function EditArmyPage() {
  const { errors } = useActionData<typeof action>() || {};
  const { army } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeading>Edit {army.name}</PageHeading>
      <Form method="post">
        <FormField isRequired label="Name" errors={errors?.name}>
          <Input type="text" name="name" defaultValue={army.name} />
        </FormField>
        <FormField isRequired label="Game system" errors={errors?.gameSystem}>
          <Input type="text" name="gameSystem" defaultValue={army.gameSystem} />
        </FormField>
        <FormField isRequired label="Faction" errors={errors?.faction}>
          <Input type="text" name="faction" defaultValue={army.faction} />
        </FormField>
        <FormField label="Description" errors={errors?.description}>
          <Textarea name="description" defaultValue={army.description} />
        </FormField>
        <Input type="hidden" name="id" value={army.id} />
        <Button type="submit">Save</Button>
      </Form>
      {army.units.length === 0 ? null : (
        <RecordTable
          columns={TABLE_COLUMNS}
          records={army.units}
          buttons={[defineEditButton(army.id), defineDeleteButton(army.id)]}
        />
      )}
      <Link to={`/armies/${army.id}/units/new`}>
        <Button>Add units</Button>
      </Link>
      <Link to="/armies">
        <Button>Back to armies</Button>
      </Link>
    </>
  );
}
