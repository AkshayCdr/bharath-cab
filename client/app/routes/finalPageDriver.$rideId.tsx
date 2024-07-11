import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
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
  const [isRideStarted, setStartRide] = useState(false);
  const [isRideEnded, setEndRide] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    function handleCancelRide(rideId) {
      if (rideId !== rideDetails.id) return;
      navigate(-1);
    }
    socket.on("cancelRide", handleCancelRide);
    return () => {
      socket.off("cancelRide", handleCancelRide);
    };
  });

  useEffect(() => {
    function handleRideNearby() {
      console.log("ride nearby inside driver page", distanceFromSource);
      socket.emit("rideNearby", rideDetails);
    }

    function handleRideStart() {
      setStartRide(true);
      socket.emit("startRide", rideDetails);
    }
    function handleRideEnd() {
      console.log("ride ended ");
      setEndRide(true);
      socket.emit("endRide", rideDetails);
      socket.disconnect();
      navigate("/login");
    }
    const isRideNearby = distanceFromSource > 1 && distanceFromSource < 3;
    //if distance <1 -> emit driver nearby
    if (isRideNearby) {
      handleRideNearby();
    }
    if (distanceFromSource === 0) {
      handleRideStart();
    }
    if (distanceFromDestination === 0) {
      // if (!isRideStarted) return;
      handleRideEnd();
      //go to payment page
    }
    //if distance <100m. ask start ride -> driver and user

    return () => {
      socket.off("rideNearby", handleRideNearby);
      socket.off("startRide", handleRideStart);
      socket.off("endRide", handleRideEnd);
    };
  }, []);

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
      {isRideStarted && <p>ride started</p>}
      {isRideEnded && <p>ride ended</p>}
    </div>
  );
}
