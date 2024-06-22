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
    <div className="text-center m-4">
      <h1 className="text-4xl m-2 font-bold">Wargame by Mail</h1>
      <p>
        An online miniature wargame simulator that lets you play with friends
        asynchronously.
      </p>
    </div>
  );
}
