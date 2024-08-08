import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import * as R from "ramda";

import { PageHeading, Button } from "~/components";
import { authenticator } from "~/.server/auth";
import db from "~/.server/db";
import {
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

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
        <TableContainer>
          <Table>
            <Tbody>
              {armies.map(({ id, name, gameSystem, faction }) => (
                <Tr key={id}>
                  <Td>{name}</Td>
                  <Td>{gameSystem}</Td>
                  <Td>{faction}</Td>
                  <Td textAlign="right" paddingRight="0.25rem">
                    <IconButton
                      aria-label="Edit"
                      icon={<EditIcon boxSize={{ base: 6 }} />}
                      padding="1rem"
                    ></IconButton>
                  </Td>
                  <Td paddingLeft="0.25rem">
                    <IconButton
                      aria-label="Delete"
                      icon={<DeleteIcon boxSize={{ base: 6 }} />}
                      padding="1rem"
                    ></IconButton>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
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
