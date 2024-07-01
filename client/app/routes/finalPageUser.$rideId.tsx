import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ride } from "apis/ride";
import { rideDetails } from "./ride.$rideId";
import { useEffect, useState } from "react";
import { socket } from "~/socket/websocket";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { rideId } = params;
  console.log(rideId);
  if (!rideId) {
    throw new Response("Not Found", { status: 404 });
  }
  const rideDetails: rideDetails = await ride.getRideDetails(rideId);

  if (!rideDetails) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ rideDetails });
};

export default function FinalPageUser() {
  const [rideLocation, setRideLocation] = useState(null);
  const { rideDetails } = useLoaderData<typeof loader>();
  console.log(rideDetails);

  useEffect(() => {
    socket.on("updateLocation", (locationData) => {
      const [latitude, longitude] = locationData;
      console.log(locationData);
      console.log(latitude, longitude);
      setRideLocation([latitude, longitude]);
    });
  });
  return <div>final page user</div>;
}
