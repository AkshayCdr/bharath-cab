import { LoaderFunctionArgs, json } from "@remix-run/node";
import { ride } from "apis/ride";
import { useState } from "react";
import Ride from "~/component/Ride";
import useRideDetails, { RideDetails } from "~/hooks/useRideDetails";
import useRideLocation from "~/hooks/useRideLocation";

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

export default function FinalPageUser() {
  const [isEditable, setIsEditable] = useState(false);

  const {
    rideDetails,
    source,
    destination,
    MapComponent,
    sourceName,
    destinationName,
  } = useRideDetails();

  const { rideLocation } = useRideLocation();

  return (
    <div>
      {MapComponent && (
        <MapComponent
          source={source}
          destination={destination}
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
