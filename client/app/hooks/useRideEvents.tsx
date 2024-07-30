import { useNavigate } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { socket } from "~/socket/websocket";

export default function useRideEvents({
  distanceFromDestination,
  distanceFromSource,
  rideDetails,
}) {
  const isRideNearbyTriggered = useRef(false);
  const isRideStartTriggered = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleRideNearby = () => {
      socket.emit("rideNearby", rideDetails);
      isRideNearbyTriggered.current = true;
    };

    const handleRideStart = () => {
      socket.emit("startRide", rideDetails);
      isRideStartTriggered.current = true;
    };

    const isRideNearby = distanceFromSource > 1 && distanceFromSource < 3;
    if (isRideNearby && !isRideNearbyTriggered.current) handleRideNearby();

    const isRideStarted = distanceFromSource === 0;
    if (isRideStarted && !isRideStartTriggered.current) handleRideStart();

    return () => {
      socket.off("rideNearby", handleRideNearby);
      socket.off("startRide", handleRideStart);
    };
  }, [distanceFromSource]);

  useEffect(() => {
    const handleRideEnd = () => {
      socket.emit("endRide", rideDetails);
      socket.disconnect();
      navigate("/driver");
    };

    const isRideEnded = distanceFromDestination === 0;
    if (isRideEnded) handleRideEnd();

    return () => {
      socket.off("endRide", handleRideEnd);
    };
  }, [distanceFromDestination]);
}
