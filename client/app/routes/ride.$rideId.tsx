import React from "react";
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return json({ params });
};

export default function Ride() {
  const { params } = useLoaderData<typeof loader>();
  console.log(params);
  return <div>Ride</div>;
}
