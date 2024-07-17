/* eslint-disable import/no-unresolved */
import { useEffect, useState } from "react";
import { useActionData, useNavigate } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { ride } from "~/apis/ride";
import RideDetails from "~/component/RideDetails";

import DriverDetails from "~/component/DriverDetails";

import styles from "../styles/ride.css?url";
import useRideDetails from "~/hooks/useRideDetails";
import useRideSocket from "~/hooks/useRideSocket";
import { socket } from "~/socket/websocket";
// import "leaflet/dist/leaflet.css";
export interface Ride {
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

  const rideDetails: Ride = await ride.getRideDetails(rideId);

  if (!rideDetails) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ rideDetails });
};

function handleRideCancel(rideDetails: Ride) {
  socket.emit("cancelRide", rideDetails.id);
}

export default function Ride() {
  const [isEditable, setIsEditable] = useState(false);
  const [isRideCancelled, setRideCancelled] = useState(false);

  const message = useActionData<typeof action>();

  const {
    rideDetails,
    source,
    destination,
    setSource,
    setDestination,
    MapComponent,
    sourceName,
    destinationName,
    setSourceName,
    setDestinationName,
  } = useRideDetails();
  const { isRideAccepted, driverDetails } = useRideSocket({
    rideDetails,
    isRideCancelled,
  });

  return (
    <div className="flex flex-row">
      <p className="flex flex-col">
        <RideDetails
          rideDetails={rideDetails}
          sourceName={sourceName}
          destinationName={destinationName}
          handleRideCancel={handleRideCancel}
          setRideCancelled={setRideCancelled}
        />
        {isRideAccepted ? (
          <DriverDetails driverDetails={driverDetails} />
        ) : (
          message && <p className="ride-message">{message.message}</p>
        )}
      </p>
      {MapComponent && (
        <MapComponent
          source={source}
          destination={destination}
          setSource={setSource}
          setDestination={setDestination}
          setSourceName={setSourceName}
          setDestinationName={setDestinationName}
          isEditable={isEditable}
        />
      )}
    </div>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
