import { useNavigate } from "@remix-run/react";
import { useCallback, useEffect, useRef } from "react";
import { socket } from "~/socket/websocket";

export default function useRideEvents({
  distanceFromDestination,
  distanceFromSource,
  rideDetails,
}) {
  // const isRideNearbyTriggered = useRef(false);

  // const isRideStartTriggered = useRef(false);

  // const navigate = useNavigate();

  // const handleRideNearby = () => {
  //   socket.emit("rideNearby", rideDetails);
  //   isRideNearbyTriggered.current = true;
  // };

  // const handleRideStart = () => {
  //   socket.emit("startRide", rideDetails);
  //   isRideStartTriggered.current = true;
  // };

  // const handleRideEnd = () => {
  //   socket.emit("endRide", rideDetails);
  //   socket.disconnect();
  //   navigate("/driver");
  // };

  // useEffect(() => {
  //   const isRideNearby = distanceFromSource > 1 && distanceFromSource < 3;

  //   if (isRideNearby && !isRideNearbyTriggered.current) handleRideNearby();

  //   const isRideStarted = distanceFromSource === 0;
  //   if (isRideStarted && !isRideStartTriggered.current) handleRideStart();

  //   const isRideEnded = distanceFromDestination === 0;
  //   if (isRideEnded) handleRideEnd();

  //   return () => {
  //     socket.off("rideNearby", handleRideNearby);
  //     socket.off("startRide", handleRideStart);
  //     socket.off("endRide", handleRideEnd);
  //   };
  // }, [distanceFromSource, distanceFromDestination]);

  const isRideNearbyTriggered = useRef(false);
  const isRideStartTriggered = useRef(false);

  const navigate = useNavigate();

  const handleRideNearby = useCallback(() => {
    socket.emit("rideNearby", rideDetails);
    isRideNearbyTriggered.current = true;
  }, [rideDetails]);

  const handleRideStart = useCallback(() => {
    socket.emit("startRide", rideDetails);
    isRideStartTriggered.current = true;
  }, [rideDetails]);

  const handleRideEnd = useCallback(() => {
    socket.emit("endRide", rideDetails);
    socket.disconnect();
    navigate("/driver");
  }, [rideDetails, navigate]);

  useEffect(() => {
    const isRideNearby = distanceFromSource > 1 && distanceFromSource < 3;

    if (isRideNearby && !isRideNearbyTriggered.current) handleRideNearby();

    const isRideStarted = distanceFromSource === 0;
    if (isRideStarted && !isRideStartTriggered.current) handleRideStart();

    const isRideEnded = distanceFromDestination === 0;
    if (isRideEnded) handleRideEnd();

    return () => {
      socket.off("rideNearby", handleRideNearby);
      socket.off("startRide", handleRideStart);
      socket.off("endRide", handleRideEnd);
    };
  }, [
    distanceFromSource,
    distanceFromDestination,
    handleRideNearby,
    handleRideStart,
    handleRideEnd,
  ]);
}
