import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Wargame by Mail" },
    {
      name: "description",
      content:
        "An online miniature wargame simulator that lets you play with friends asynchronously.",
    },
  ];
};

export default function Index() {
  return (
    <>
      <h1>Wargame by Mail</h1>
      <p>
        An online miniature wargame simulator that lets you play with friends
        asynchronously.
      </p>
    </>
  );
}
