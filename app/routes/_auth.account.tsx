import { MetaFunction } from "@remix-run/node";
import { Link, useOutletContext } from "@remix-run/react";

import type { User } from "~/.server/db";
import { PageHeading, Button } from "~/components";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail: Your account" },
    {
      name: "description",
      content: "Your account info and settings.",
    },
  ];
};

export default function AccountPage() {
  const {
    user: { username },
  } = useOutletContext<{ user: User }>();

  return (
    <>
      <PageHeading>{username}</PageHeading>
      <Link to={"/games/new"}>
        <Button>Build an army</Button>
      </Link>
    </>
  );
}
