import { LoaderFunctionArgs, json } from "@remix-run/node";
import { ride } from "apis/ride";
import { useEffect, useState } from "react";

import useRideDetails, { RideDetails } from "~/hooks/useRideDetails";
import useRideLocation from "~/hooks/useRideLocation";
import Details from "../component/Details";

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

  const { rideLocation, rideNearby, rideStatus } = useRideLocation();

  useEffect(() => {
    if (rideNearby) {
      alert("ride Nearby");
    }
  }, [rideNearby]);

  useEffect(() => {
    if (rideStatus === "start") {
      alert("ride started");
    }
    if (rideStatus === "end") {
      alert("ride ended");
    }
  }, [rideStatus]);

  return (
    <div className="flex flex-row m-5 p-3">
      <Details
        rideDetails={rideDetails}
        sourceName={sourceName}
        destinationName={destinationName}
      />
      {MapComponent && (
        <MapComponent
          source={source}
          destination={destination}
          isEditable={isEditable}
          rideLocation={rideLocation}
        />
      )}
    </div>
  );
}
