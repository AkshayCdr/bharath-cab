// import { useNavigate } from "@remix-run/react";
// import { useEffect, useRef } from "react";
// import { socket } from "~/socket/websocket";

// const handleRideEnd = (rideDetails,navigate) => {
//   socket.emit("endRide", rideDetails);
//   socket.disconnect();
//   navigate("/driver");
// };

// const handleRideNearby = (rideDetails,isRideNearbyTriggered) => {
//   socket.emit("rideNearby", rideDetails);
//   isRideNearbyTriggered.current = true;
// };

// const handleRideStart = (rideDetails,isRideStartTriggered) => {
//   socket.emit("startRide", rideDetails);
//   isRideStartTriggered.current = true;
// };

// export default function useRideEvents({
//   distanceFromDestination,
//   distanceFromSource,
//   rideDetails,
// }) {
//   const isRideNearbyTriggered = useRef(false);
//   const isRideStartTriggered = useRef(false);

//   useEffect(() => {
//     return () => {
//       socket.off("rideNearby", handleRideNearby);
//       socket.off("startRide", handleRideStart);
//       socket.off("endRide", handleRideEnd);
//     };
//   }, []);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const isRideNearby = distanceFromSource > 1 && distanceFromSource < 3;
//     if (isRideNearby && !isRideNearbyTriggered.current) handleRideNearby(rideDetails,);

//     const isRideStarted = distanceFromSource === 0;
//     if (isRideStarted && !isRideStartTriggered.current) handleRideStart();
//   }, [distanceFromSource]);

//   useEffect(() => {
//     const isRideEnded = distanceFromDestination === 0;
//     if (isRideEnded) handleRideEnd();
//   }, [distanceFromDestination]);
// }
