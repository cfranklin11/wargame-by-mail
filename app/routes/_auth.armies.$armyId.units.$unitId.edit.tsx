import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  Link,
  MetaFunction,
  useActionData,
  useLoaderData,
  useOutletContext,
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
import { Input, Select, Textarea } from "@chakra-ui/react";
import { convertToModelData, formatValidationErrors } from "~/utils/form";
import { Unit, UnitWithMiniatures } from "~/models/unit";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ArmyWithUnits } from "~/models/army";
import { extractUserId } from "~/.server/auth";
import { idFromParams } from "~/utils/request";

const TABLE_COLUMNS = [{ key: "name", label: "Name" }];

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Edit a unit in your army" },
    {
      name: "description",
      content: "Edit the characteristics of a unit in your army.",
    },
  ];
};

export function loader() {
  return R.pipe(
    db.baseShape.findMany,
    R.andThen(R.objOf("baseShapes")),
    R.andThen(json),
  )();
}

const prepareUpdateParams = ({
  id,
  armyId,
  userId,
  baseShapeId,
  ...unit
}: Unit & { userId: number }) => ({
  where: { id, armyId, army: { is: { userId } } },
  data: {
    ...unit,
    baseShapeId,
  },
});

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await extractUserId(request);
  const armyId = idFromParams("armyId")(params);
  const id = idFromParams("userId")(params);

  try {
    await R.pipe(
      R.invoker(0, "formData"),
      R.andThen(convertToModelData),
      R.andThen(R.mergeLeft({ armyId, userId, id })<Unit>),
      R.andThen(prepareUpdateParams),
      R.andThen(db.unit.update),
    )(request);

    return null;
  } catch (error) {
    if (error instanceof ZodError) {
      return R.pipe(formatValidationErrors, R.objOf("errors"), json)(error);
    }

    throw error;
  }
}

const defineEditButton = (unitId: number) => {
  const EditButton = (miniatureId: number) => (
    <Link to={`/units/${unitId}/miniatures/${miniatureId}/edit`}>
      <IconButton label="Edit" Icon={EditIcon}></IconButton>
    </Link>
  );
  return EditButton;
};
const defineDeleteButton = (unitId: number) => {
  const DeleteButton = (miniatureId: number) => (
    <Link to={`/units/${unitId}/miniatures/${miniatureId}/delete`}>
      <IconButton label="Delete" Icon={DeleteIcon}></IconButton>
    </Link>
  );
  return DeleteButton;
};

export default function EditUnitPage() {
  const { baseShapes } = useLoaderData<typeof loader>();
  const { errors } = useActionData<typeof action>() || {};
  const { army, unit } = useOutletContext<{
    army: ArmyWithUnits;
    unit: UnitWithMiniatures;
  }>();

  return (
    <>
      <PageHeading>Edit {unit.name}</PageHeading>
      <Form method="post">
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
          <Select name="baseShapeId" defaultValue={unit.baseShapeId}>
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
        <Button type="submit">Save</Button>
      </Form>
      {unit.miniatures.length === 0 ? null : (
        <RecordTable
          columns={TABLE_COLUMNS}
          records={unit.miniatures}
          buttons={[defineEditButton(unit.id), defineDeleteButton(unit.id)]}
        />
      )}
      <Link to={`/units/${unit.id}/miniatures/new`}>
        <Button>Add models</Button>
      </Link>
      <Link to={`/armies/${army.id}/edit`}>
        <Button>Back to army</Button>
      </Link>
    </>
  );
}
