/* eslint-disable import/no-unresolved */
import { useEffect, useState } from "react";
import { useActionData, useLoaderData } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { ride } from "apis/ride";
import RideDetails from "~/component/RideDetails";
import { socket } from "~/socket/websocket";
import DriverDetails from "~/component/DriverDetails";
// import invariant from "tiny-invariant";
import styles from "../styles/ride.css?url";

interface rideDetails {
  id: string;
  source: Coordinates;
  destination: Coordinates;
  price: string;
  user_id: string;
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

  const [rideStatus, setRideStatus] = useState(false);
  const [driverDetails, setDriverDetails] = useState({});

  useEffect(() => {
    socket.emit("registerClient", rideDetails.user_id);
    socket.on("rideAccepted", (driverDetails) => {
      console.log("ride accepted by driver ", driverDetails);
      setRideStatus(true);
      setDriverDetails(driverDetails);
      console.log(driverDetails);
    });
    socket.on("updateLocation", (locationData) => {
      const [latitude, longitude] = locationData;
      console.log(latitude, longitude);
    });

    return () => {
      socket.off("connect");
      socket.off("registerClient");
      socket.off("rideAccepted");
      socket.off("updateLocation");
    };
  }, []);

  return (
    <div className="ride-details">
      <RideDetails rideDetails={rideDetails} />
      {rideStatus ? (
        <DriverDetails driverDetails={driverDetails} />
      ) : (
        message && <p className="ride-message">{message.message}</p>
      )}
    </div>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
