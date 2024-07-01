import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ride } from "apis/ride";
import { useEffect, useState } from "react";
import { socket } from "~/socket/websocket";
import Ride from "~/component/Ride";
import useRideDetails from "~/hooks/useRideDetails";

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
  const [isEditable, setIsEditable] = useState(false);
  const [sourceName, setSourceName] = useState(null);
  const [destinationName, setDestinationName] = useState(null);

  const {
    rideDetails,
    source,
    destination,
    setSource,
    setDestination,
    MapComponent,
  } = useRideDetails();

  useEffect(() => {
    const handleUpdateLocation = (locationData) => {
      const [latitude, longitude] = locationData;
      setRideLocation([latitude, longitude]);
    };

    socket.on("updateLocation", handleUpdateLocation);

    return () => {
      socket.off("updateLocation", handleUpdateLocation);
    };
  }, []);

  return (
    <div>
      {MapComponent && (
        <MapComponent
          source={source}
          destination={destination}
          setSource={setSource}
          setDestination={setDestination}
          setSourceName={setSourceName}
          setDestinationName={setDestinationName}
          isEditable={isEditable}
          rideLocation={rideLocation}
        />
      )}
      <Ride
        rideDetails={rideDetails}
        sourceName={sourceName}
        destinationName={destinationName}
      />
    </div>
  );
}
