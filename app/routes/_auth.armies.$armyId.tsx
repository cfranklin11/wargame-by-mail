import { Box } from "@chakra-ui/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import * as R from "ramda";
import invariant from "tiny-invariant";

import { Army, assertHasUnits, findArmy } from "~/models/army";
import { idFromParams } from "~/utils/request";

export function loader({ params }: LoaderFunctionArgs) {
  return R.pipe(
    idFromParams("armyId"),
    (armyId) => findArmy(armyId, { include: { units: true } }),
    R.andThen(
      R.tap<Army | null, Army>((maybeArmy) => invariant(maybeArmy !== null)),
    ),
    R.andThen(R.tap(assertHasUnits)),
    R.andThen(R.objOf("army")),
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
