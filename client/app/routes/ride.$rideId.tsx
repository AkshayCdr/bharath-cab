/* eslint-disable import/no-unresolved */
import React from "react";
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { ride } from "apis/ride";
// import invariant from "tiny-invariant";

interface rideDetails {
  id: string;
  source: Coordinates;
  destination: Coordinates;
  price: string;
}

type Coordinates = {
  x?: number;
  y?: number;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // invariant(params.rideId, "Missing rideId param");
  const rideDetails: rideDetails = await ride.getRideDetails(params.rideId);
  if (!rideDetails) throw new Response("Not Found", { status: 404 });
  return json({ rideDetails });
};

export default function Ride() {
  const { rideDetails } = useLoaderData<typeof loader>();
  console.log(rideDetails);
  return (
    <div>
      <h1>ride details</h1>
      <ul key={rideDetails.id}>
        <li>Source</li>
        <li>{rideDetails.source.x}</li>
        <li>{rideDetails.source.y}</li>
        <li>Destination</li>
        <li>{rideDetails.destination.x}</li>
        <li>{rideDetails.source.y}</li>
        <li>{rideDetails.price}</li>
      </ul>
      <button>Accept</button>
      <button>Cancel</button>
    </div>
  );
}
