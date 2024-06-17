/* eslint-disable import/no-unresolved */
import React from "react";
import { useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { ride } from "apis/ride";
import RideDetails from "~/component/RideDetails";
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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const rideID = formData.get("rideId");
  const message = await ride.requestForRide(rideID);
  console.log(message);
  return json({ message });
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { rideId } = params;

  if (!rideId) {
    throw new Response("Not Found", { status: 404 });
  }

  const rideDetails: rideDetails = await ride.getRideDetails(rideId);

  if (!rideDetails) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ rideDetails });
};

export default function Ride() {
  const { rideDetails } = useLoaderData<typeof loader>();
  const message = useActionData<typeof action>();
  console.log(rideDetails);
  return (
    <div>
      {message ? <p>{message.message}</p> : <p>no value</p>}
      <RideDetails rideDetails={rideDetails} />
    </div>
  );
}
