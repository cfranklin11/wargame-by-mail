import { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/.server/auth";

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticator.logout(request, { redirectTo: "/login" });
};
