import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { driver } from "apis/driver";
import { ride } from "apis/ride";
import { useState } from "react";
import useLocation from "~/hooks/useLocation";
import useRideDetails, { RideDetails } from "~/hooks/useRideDetails";
import Ride from "~/component/Ride";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { rideId } = params;

  if (!rideId) {
    throw new Response("Not Found", { status: 404 });
  }
  const rideDetails: RideDetails = await ride.getRideDetails(rideId);

  if (!rideDetails) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ rideDetails });
};

export default function FinalPageDriver() {
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

  const { currentLocation } = useLocation(rideDetails.id);

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
          rideLocation={currentLocation}
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
