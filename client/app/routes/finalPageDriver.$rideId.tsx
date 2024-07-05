import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { driver } from "apis/driver";
import { ride } from "apis/ride";
import { useEffect, useState } from "react";
import useLocation from "~/hooks/useLocation";
import useRideDetails, { RideDetails } from "~/hooks/useRideDetails";
import Details from "../component/Details";
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
  const { distance: distanceFromSource } = useRoute(currentLocation, source);
  const { distance: distanceFromDestination } = useRoute(
    currentLocation,
    destination
  );
  console.log(distanceFromSource);

  useEffect(() => {
    //if distance <1 -> emit driver nearby
    if (distanceFromSource > 1 && distanceFromSource < 3) {
      console.log("ride nearby inside driver page", distanceFromSource);
      socket.emit("rideNearby", rideDetails);
    }
    if (distanceFromSource === 0) {
      setStartRide(true);
      socket.emit("startRide", rideDetails);
    }
    if (distanceFromDestination === 0) {
      socket.emit("endRide", rideDetails);
    }
    //if distance <100m. ask start ride -> driver and user

    return () => {};
  }, [distanceFromSource, distanceFromDestination, rideDetails]);

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
          rideLocation={currentLocation}
        />
      )}
      {startRide && <p>ride started</p>}
    </div>
  );
}
