import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { driver } from "apis/driver";
import { ride } from "apis/ride";
import { useEffect, useState } from "react";
import useLocation from "~/hooks/useLocation";
import useRideDetails, { RideDetails } from "~/hooks/useRideDetails";
import Ride from "~/component/Ride";
import { socket } from "~/socket/websocket";
import useRoute from "~/hooks/useRoute";

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
  const [startRide, setStartRide] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const {
    rideDetails,
    source,
    destination,
    MapComponent,
    sourceName,
    destinationName,
  } = useRideDetails();

  const { currentLocation } = useLocation(rideDetails.id);
  const { distance } = useRoute(source, destination);

  useEffect(() => {
    //if distance <1 -> emit driver nearby
    if (distance > 0.1 && distance < 3) {
      console.log("ride nearby inside driver page", distance);
      socket.emit("rideNearby", rideDetails);
    }
    if (distance > 0.1 && distance < 1) {
      setStartRide(true);
      socket.emit("startRide", rideDetails);
    }
    if (currentLocation === destination) {
      socket.emit("endRide", rideDetails);
    }
    //if distance <100m. ask start ride -> driver and user

    return () => {};
  }, [distance, rideDetails, currentLocation, destination]);

  return (
    <div>
      {MapComponent && (
        <MapComponent
          source={source}
          destination={destination}
          isEditable={isEditable}
          rideLocation={currentLocation}
        />
      )}
      <Ride
        rideDetails={rideDetails}
        sourceName={sourceName}
        destinationName={destinationName}
      />
      {startRide && <p>ride started</p>}
    </div>
  );
}
