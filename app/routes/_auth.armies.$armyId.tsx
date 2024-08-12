import { Box } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, redirect, useLoaderData } from "@remix-run/react";
import * as R from "ramda";
import { extractUserId } from "~/.server/auth";

import { Army, assertHasUnits, findArmyBy } from "~/models/army";
import { idFromParams } from "~/utils/request";

const prepareResponse = (army: Army) =>
  R.pipe(R.tap(assertHasUnits), R.objOf("army"), json)(army);
export async function loader({ params, request }: LoaderFunctionArgs) {
  const userId = await extractUserId(request);

  return R.pipe(
    idFromParams("armyId"),
    (id) => findArmyBy({ where: { id, userId }, include: { units: true } }),
    R.andThen(
      R.ifElse(
        (maybeArmy): maybeArmy is Army => maybeArmy !== null,
        prepareResponse,
        () => redirect("/armies"),
      ),
    ),
  )(params);
}

export default function ArmyPage() {
  const { army } = useLoaderData<typeof loader>();

  return (
    <Box>
      <Outlet context={{ army }} />
    </Box>
  );
}
