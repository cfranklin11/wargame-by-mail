import { Box } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Outlet,
  redirect,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import * as R from "ramda";
import { extractUserId } from "~/.server/auth";
import { findMiniatureBy, Miniature } from "~/models/miniature";

import { UnitWithMiniatures } from "~/models/unit";
import { idFromParams } from "~/utils/request";

const prepareResponse = (miniature: Miniature) =>
  R.pipe(R.objOf("miniature"), json)(miniature);

export async function loader({ params, request }: LoaderFunctionArgs) {
  const userId = await extractUserId(request);

  return R.pipe(
    idFromParams("miniatureId"),
    (id) =>
      findMiniatureBy({
        id,
        unit: { is: { army: { is: { userId } } } },
      }),
    R.andThen(
      R.ifElse(
        (miniature: Miniature | null): miniature is Miniature =>
          miniature !== null,
        prepareResponse,
        () => redirect("/armies"),
      ),
    ),
  )(params);
}

export default function MiniaturePage() {
  const { miniature } = useLoaderData<typeof loader>();
  const { unit } = useOutletContext<{
    unit: UnitWithMiniatures;
  }>();

  return (
    <Box>
      <Outlet context={{ unit, miniature }} />
    </Box>
  );
}
