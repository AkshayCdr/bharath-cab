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

import styles from "../styles/ride.css?url";
// import "leaflet/dist/leaflet.css";
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
  const [MapComponent, setMapComponent] = useState(null);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);

  const { rideDetails } = useLoaderData<typeof loader>();

  const message = useActionData<typeof action>();

  const [isRideAccepted, setRideStatus] = useState(false);
  const [driverDetails, setDriverDetails] = useState({});

  const [rideLocation, setRideLocation] = useState(null);

  useEffect(() => {
    import("../component/Map").then((module) =>
      setMapComponent(() => module.default)
    );
  }, []);

  useEffect(() => {
    if (rideDetails) {
      setSource([rideDetails.destination.y, rideDetails.destination.x]);
      setDestination([rideDetails.source.y, rideDetails.source.x]);
    }
  }, [rideDetails]);

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
      console.log(locationData);
      console.log(latitude, longitude);
      setRideLocation([latitude, longitude]);
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
      {MapComponent && (
        <MapComponent
          source={source}
          destination={destination}
          setSource={setSource}
          setDestination={setDestination}
          rideLocation={rideLocation}
        />
      )}
      <RideDetails rideDetails={rideDetails} />
      {isRideAccepted ? (
        <DriverDetails driverDetails={driverDetails} />
      ) : (
        message && <p className="ride-message">{message.message}</p>
      )}
    </div>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
