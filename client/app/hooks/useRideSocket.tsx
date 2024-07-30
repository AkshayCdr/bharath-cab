import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { socket } from "~/socket/websocket";

export default function useRideSocket({ rideDetails, isRideCancelled }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRideAccepted = (driverDetails) => {
      // if (isRideCancelled) navigate(-1);
      console.log("ride accepted by driver ", driverDetails);
      navigate(`/finalPageUser`);
    };

    socket.emit("registerClient", rideDetails.user_id);
    socket.on("rideAccepted", handleRideAccepted);

    return () => {
      socket.off("registerClient");
      socket.off("rideAccepted", handleRideAccepted);
    };
  }, []);
}
