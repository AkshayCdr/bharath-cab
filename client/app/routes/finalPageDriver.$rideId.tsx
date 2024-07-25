import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

import { ride } from "~/apis/ride";
import { useEffect, useRef, useState } from "react";
import useLocation from "~/hooks/useLocation";
import useRideDetails, { RideDetails } from "~/hooks/useRideDetails";
import Details from "../component/Details";
import { socket } from "~/socket/websocket";
import useRoute from "~/hooks/useRoute";
import { requireAuthCookie } from "~/utils/auth.server";

import Mapcontainer from "~/component/Mapcontainer";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireAuthCookie(request);

  const { rideId } = params;

  if (!rideId) {
    throw new Response("Not Found", { status: 404 });
  }
  const rideDetails = await ride.getRideAndUser(rideId);

  if (!rideDetails) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ rideDetails });
};

export default function FinalPageDriver() {
  const [isRideStarted, setStartRide] = useState(false);
  const [isRideEnded, setEndRide] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const role = "driver";

  const navigate = useNavigate();
  const { rideDetails } = useLoaderData<typeof loader>();

  const { source, destination, sourceName, destinationName } =
    useRideDetails(rideDetails);

  const { currentLocation } = useLocation(rideDetails.id);

  const { distance: distanceFromSource } = useRoute(currentLocation, source);

  const { distance: distanceFromDestination } = useRoute(
    currentLocation,
    destination
  );

  useEffect(() => {
    function handleCancelRide(rideId) {
      if (rideId !== rideDetails.id) return;
      navigate("/driver");
    }
    socket.on("cancelRide", handleCancelRide);
    return () => {
      socket.off("cancelRide", handleCancelRide);
    };
  }, []);

  const isRideNearbySend = useRef(false);

  useEffect(() => {
    function handleRideNearby() {
      console.log("ride nearby inside driver page", distanceFromSource);
      socket.emit("rideNearby", rideDetails);
    }

    if (isRideNearbySend.current) return;

    const isRideNearby = distanceFromSource > 1 && distanceFromSource < 3;
    if (isRideNearby) {
      isRideNearbySend.current = true;
      handleRideNearby();
    }

    return () => {
      socket.off("rideNearby", handleRideNearby);
    };
  }, [distanceFromSource, rideDetails]);

  const isRideStart = useRef(false);

  useEffect(() => {
    function handleRideStart() {
      setStartRide(true);
      console.log("sending start ride ");
      socket.emit("startRide", rideDetails);
    }

    if (isRideStart.current) return;

    const isRideStarted = distanceFromSource === 0;
    if (isRideStarted) {
      isRideStart.current = true;
      handleRideStart();
    }
    return () => {
      socket.off("startRide", handleRideStart);
    };
  }, [distanceFromSource, rideDetails]);

  const isRideEnd = useRef(false);

  useEffect(() => {
    function handleRideEnd() {
      console.log("ride ended ");
      setEndRide(true);
      socket.emit("endRide", rideDetails);
      socket.disconnect();
      navigate("/driver");
    }

    if (isRideEnd.current) return;

    const isRideEnded = distanceFromDestination === 0;
    if (isRideEnded) {
      isRideEnd.current = true;
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
        role={role}
      />
      <Mapcontainer
        source={source}
        destination={destination}
        isEditable={isEditable}
        rideLocation={currentLocation}
      ></Mapcontainer>

      {isRideStarted && <p>ride started</p>}
      {isRideEnded && <p>ride ended</p>}
    </div>
  );
}
