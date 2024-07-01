import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ride } from "apis/ride";
import { useEffect, useState } from "react";
import { socket } from "~/socket/websocket";
import Ride from "~/component/Ride";

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
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [MapComponent, setMapComponent] = useState(null);

  const [sourceName, setSourceName] = useState(null);
  const [destinationName, setDestinationName] = useState(null);

  const { rideDetails } = useLoaderData<typeof loader>();
  console.log(rideDetails);

  useEffect(() => {
    if (rideDetails) {
      setSource([rideDetails.destination.y, rideDetails.destination.x]);
      setDestination([rideDetails.source.y, rideDetails.source.x]);
    }
  }, [rideDetails]);

  useEffect(() => {
    import("../component/Map").then((module) =>
      setMapComponent(() => module.default)
    );
  }, []);

  useEffect(() => {
    socket.on("updateLocation", (locationData) => {
      const [latitude, longitude] = locationData;
      console.log(locationData);
      console.log(latitude, longitude);
      setRideLocation([latitude, longitude]);
    });
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
