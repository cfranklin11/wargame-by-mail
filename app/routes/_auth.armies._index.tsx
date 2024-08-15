import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import * as R from "ramda";

import { PageHeading, Button, RecordTable } from "~/components";
import { extractUserId } from "~/.server/auth";
import db from "~/.server/db";
import IconButton from "~/components/IconButton";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const TABLE_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "gameSystem", label: "Game" },
  { key: "faction", label: "Faction" },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Your armies" },
    {
      name: "description",
      content: "List of armies that you've created.",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return R.pipe(
    extractUserId,
    R.andThen(R.objOf("userId")),
    R.andThen(R.objOf("where")),
    R.andThen(db.army.findMany),
    R.andThen(R.objOf("armies")),
    R.andThen(json),
  )(request);
}

const EditButton = (armyId: number) => (
  <Link to={`/armies/${armyId}/edit`}>
    <IconButton label="Edit" Icon={EditIcon}></IconButton>
  </Link>
);
const DeleteButton = (armyId: number) => (
  <Link to={`/armies/${armyId}/delete`}>
    <IconButton label="Delete" Icon={DeleteIcon}></IconButton>
  </Link>
);

export default function ArmiesPage() {
  const { armies } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeading>Your armies</PageHeading>
      {armies.length === 0 ? null : (
        <RecordTable
          columns={TABLE_COLUMNS}
          records={armies}
          buttons={[EditButton, DeleteButton]}
        />
      )}
      <Link to={"/armies/new"}>
        <Button>Build an army</Button>
      </Link>
      <Link to={"/account"}>
        <Button>Back to account</Button>
      </Link>
    </>
  );
}
