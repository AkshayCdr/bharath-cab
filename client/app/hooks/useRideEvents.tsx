import { useNavigate } from "@remix-run/react";
import { useEffect, useCallback, useRef } from "react";
import { socket } from "~/socket/websocket";

export default function useRideEvents({
  distanceFromDestination,
  distanceFromSource,
  rideDetails,
}) {
  const isRideNearbyTriggered = useRef(false);

  const isRideStartTriggered = useRef(false);

  const navigate = useNavigate();

  const handleRideNearby = () => {
    socket.emit("rideNearby", rideDetails);
    isRideNearbyTriggered.current = true;
  };

  const handleRideStart = () => {
    socket.emit("startRide", rideDetails);
    isRideStartTriggered.current = true;
  };

  const handleRideEnd = () => {
    socket.emit("endRide", rideDetails);
    socket.disconnect();
    navigate("/driver");
  };

  useEffect(() => {
    const isRideNearby = distanceFromSource > 1 && distanceFromSource < 3;

    if (isRideNearby) handleRideNearby();

    const isRideStarted = distanceFromSource === 0;
    if (isRideStarted) handleRideStart();

    const isRideEnded = distanceFromDestination === 0;
    if (isRideEnded) handleRideEnd();

    return () => {
      socket.off("rideNearby", handleRideNearby);
      socket.off("startRide", handleRideStart);
      socket.off("endRide", handleRideEnd);
    };
  }, [distanceFromSource, distanceFromDestination]);

  //   useEffect(() => {
  //     socket.on("cancelRide", handleCancelRide);
  //     socket.on("rideNearby", handleRideNearby);
  //     socket.on("startRide", handleStartRide);
  //     socket.on("endRide", handleEndRide);

  //     return () => {
  //       socket.off("cancelRide", handleCancelRide);
  //       socket.off("rideNearby", handleRideNearby);
  //       socket.off("startRide", handleStartRide);
  //       socket.off("endRide", handleEndRide);
  //     };
  //   }, []);
}
