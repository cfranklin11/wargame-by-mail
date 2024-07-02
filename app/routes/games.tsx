import { ActionFunction, redirect } from "@remix-run/node";
import db from "../.server/db";

import type { Game } from "../.server/db";

type GameFormData = Pick<Game, "name" | "description">;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const gameAttributes = Object.fromEntries(formData) as GameFormData;

  const game = await db.game.create({ data: gameAttributes });
  return redirect(`/games/${game.id}/edit`);
};
