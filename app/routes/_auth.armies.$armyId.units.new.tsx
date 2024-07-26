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
import db, { Army, BaseShape, Unit } from "~/.server/db";
import { Button, FormField, PageHeading } from "~/components";
import { Input, Select, Textarea } from "@chakra-ui/react";

const SUBMIT_TYPES = ["save", "addMiniatures"];

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
    R.prop("armyId"),
    R.tap((armyId) => invariant(typeof armyId === "string")),
    parseInt,
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
  const formData = await request.formData();
  const submitType = formData.get("submit");

  invariant(
    typeof submitType === "string" && SUBMIT_TYPES.includes(submitType),
  );

  const unit = await R.pipe(
    R.invoker(0, "entries"),
    R.map(([key, value]) => [
      key,
      Number.isNaN(parseInt(value)) ? value : parseInt(value),
    ]),
    Object.fromEntries,
    R.omit(["submit"])<Unit & { submit: string }>,
    R.objOf("data")<Unit>,
    db.unit.create,
  )(formData);

  if (submitType === "save") return json({ unit });

  if (submitType === "addMiniatures")
    return redirect(`/units/${unit.id}/miniatures/new`);
}

export default function NewUnitPage() {
  const { army, baseShapes } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeading>Add a unit to {army.name}</PageHeading>
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
        <FormField isRequired label="Base shape">
          <Select placeholder="Select models' base shape" name="baseShapeId">
            {baseShapes.map(({ name, id }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField isRequired label="Base length (mm)">
          <Input
            type="number"
            name="baseLength"
            min={1}
            step={1}
            defaultValue={25}
          />
        </FormField>
        <FormField isRequired label="Base width (mm)">
          <Input
            type="number"
            name="baseWidth"
            min={1}
            step={1}
            defaultValue={25}
          />
        </FormField>
        <FormField isRequired label="Model color">
          <Input type="color" name="color" />
        </FormField>
        <Input type="hidden" name="armyId" value={army.id} />
        <Link to={`/armies/${army.id}`}>
          <Button>Back</Button>
        </Link>
        <Button type="submit" value="save" name="submit">
          Save
        </Button>
        <Button type="submit" value="addMiniatures" name="submit">
          Add models
        </Button>
      </Form>
    </>
  );
}
