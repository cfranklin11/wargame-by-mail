import { Box } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Outlet,
  redirect,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import * as R from "ramda";
import invariant from "tiny-invariant";

import { Unit, assertHasMiniatures, findUnit } from "~/models/unit";
import { Army } from "~/models/army";
import { idFromParams } from "~/utils/request";

const prepareResponse = (unit: Unit) =>
  R.pipe(R.tap(assertHasMiniatures), R.objOf("unit"), json)(unit);

export async function loader({ params }: LoaderFunctionArgs) {
  const armyId = idFromParams("armyId")(params);

  return R.pipe(
    idFromParams("unitId"),
    (unitId) => findUnit(unitId, { include: { miniatures: true } }),
    R.andThen(
      R.tap<Unit | null, Unit>((maybeUnit) => invariant(maybeUnit !== null)),
    ),
    R.andThen(
      R.ifElse(
        (unit) => unit.armyId === armyId,
        prepareResponse,
        () => redirect("/armies"),
      ),
    ),
  )(params);
}

export default function UnitPage() {
  const { unit } = useLoaderData<typeof loader>();
  const { army } = useOutletContext<{ army: Army }>();

  return (
    <Box>
      <Outlet context={{ unit, army }} />
    </Box>
  );
}
