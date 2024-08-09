import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import * as R from "ramda";

import { PageHeading, Button, RecordTable } from "~/components";
import { authenticator } from "~/.server/auth";
import db from "~/.server/db";

const TABLE_LABELS = {
  name: "Name",
  gameSystem: "Game",
  faction: "Faction",
};

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
    (request) =>
      authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
      }),
    R.andThen(R.prop("id")),
    R.andThen(R.objOf("userId")),
    R.andThen(R.objOf("where")),
    R.andThen(db.army.findMany),
    R.andThen(R.objOf("armies")),
    R.andThen(json),
  )(request);
}

export default function ArmiesPage() {
  const { armies } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeading>Your armies</PageHeading>
      {armies.length === 0 ? null : (
        <RecordTable
          columns={["name", "gameSystem", "faction"]}
          records={armies}
          labelMap={TABLE_LABELS}
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
