import { Params } from "@remix-run/react";
import * as R from "ramda";
import invariant from "tiny-invariant";

export function idFromParams(idKey: string) {
  return (params: Params<string>) =>
    R.pipe(
      R.prop(idKey)<Params<string>>,
      R.tap((id) => invariant(typeof id === "string")),
      parseInt,
    )(params);
}
