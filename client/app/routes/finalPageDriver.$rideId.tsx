import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { driver } from "~/apis/driver";
import { ride } from "~/apis/ride";
import { useEffect, useState } from "react";
import useLocation from "~/hooks/useLocation";
import useRideDetails, { RideDetails } from "~/hooks/useRideDetails";
import Details from "../component/Details";
import { socket } from "~/socket/websocket";
import useRoute from "~/hooks/useRoute";
import { requireSession } from "~/utils/auth.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  requireSession(request);
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
  }, []);

  useEffect(() => {
    function handleRideNearby() {
      console.log("ride nearby inside driver page", distanceFromSource);
      socket.emit("rideNearby", rideDetails);
    }

    const isRideNearby = distanceFromSource > 1 && distanceFromSource < 3;
    if (isRideNearby) {
      handleRideNearby();
    }

    return () => {
      socket.off("rideNearby", handleRideNearby);
    };
  }, [distanceFromSource, rideDetails]);

  useEffect(() => {
    function handleRideStart() {
      setStartRide(true);
      console.log("sending start ride ");
      socket.emit("startRide", rideDetails);
    }

    const isRideStarted = distanceFromSource === 0;
    if (isRideStarted) {
      handleRideStart();
    }
    return () => {
      socket.off("startRide", handleRideStart);
    };
  }, [distanceFromSource, rideDetails]);

  useEffect(() => {
    function handleRideEnd() {
      console.log("ride ended ");
      setEndRide(true);
      socket.emit("endRide", rideDetails);
      socket.disconnect();
      navigate("/login");
    }

    const isRideEnded = distanceFromDestination === 0;
    if (isRideEnded) {
      handleRideEnd();
    }

    return () => {
      socket.off("endRide", handleRideEnd);
    };
  }, [distanceFromDestination, navigate, rideDetails]);

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
