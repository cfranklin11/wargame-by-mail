import { Box } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Outlet,
  redirect,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import * as R from "ramda";

import { Unit, assertHasMiniatures, findUnitBy } from "~/models/unit";
import { Army } from "~/models/army";
import { idFromParams } from "~/utils/request";
import { extractUserId } from "~/.server/auth";

const prepareResponse = (unit: Unit) =>
  R.pipe(R.tap(assertHasMiniatures), R.objOf("unit"), json)(unit);

export async function loader({ params, request }: LoaderFunctionArgs) {
  const armyId = idFromParams("armyId")(params);
  const userId = await extractUserId(request);

  return R.pipe(
    idFromParams("unitId"),
    (id) =>
      findUnitBy(
        { id, army: { is: { id: armyId, userId } } },
        { include: { miniatures: true } },
      ),
    R.andThen(
      R.ifElse(
        (unit: Unit | null): unit is Unit => unit !== null,
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
