import { ActionFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  Link,
  MetaFunction,
  useActionData,
  useOutletContext,
} from "@remix-run/react";
import * as R from "ramda";
import { Input, Textarea } from "@chakra-ui/react";
import { ZodError } from "zod";

import db from "~/.server/db";
import { Button, FormField, PageHeading } from "~/components";
import { convertToModelData, formatValidationErrors } from "~/utils/form";
import { Miniature } from "~/models/miniature";
import { UnitWithMiniatures } from "~/models/unit";
import { extractUserId } from "~/.server/auth";
import { idFromParams } from "~/utils/request";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Edit models in your unit" },
    {
      name: "description",
      content: "Edit the characteristics of the models in your unit.",
    },
  ];
};

const prepareUpdateParams = ({
  id,
  userId,
  ...data
}: Miniature & { userId: number }) => ({
  where: {
    id,
    unit: { is: { army: { is: { userId } } } },
  },
  data,
});

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await extractUserId(request);
  const id = idFromParams("miniatureId")(params);

  try {
    await R.pipe(
      R.invoker(0, "formData"),
      R.andThen(convertToModelData),
      R.andThen(R.mergeLeft({ userId, id })<Miniature & { userId: number }>),
      R.andThen(prepareUpdateParams),
      R.andThen(db.miniature.update),
    )(request);

    return null;
  } catch (error) {
    if (error instanceof ZodError) {
      return R.pipe(formatValidationErrors, R.objOf("errors"), json)(error);
    }

    throw error;
  }
}

export default function NewUnitPage() {
  const { unit, miniature } = useOutletContext<{
    unit: UnitWithMiniatures;
    miniature: Miniature;
  }>();
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
        <Button type="submit">Save</Button>
      </Form>
      <Link to={`/armies/${unit.armyId}/units/${unit.id}/edit`}>
        <Button>Back to unit</Button>
      </Link>
    </>
  );
}
