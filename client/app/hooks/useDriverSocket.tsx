import { useNavigate } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { socket } from "~/socket/websocket";

export default function useDriverSocket(driverId, setUserDetails, userDetails) {
  const navigate = useNavigate();
  const userDetailsRef = useRef(userDetails);

  useEffect(() => {
    userDetailsRef.current = userDetails;
  }, [userDetails]);

  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket driver connected with id:", socket.id);
    };

    const handleRideRequest = (userDetails) => {
      console.log("Received ride request:", userDetails);
      setUserDetails(userDetails);
    };

    const handleLockRide = (Id) => {
      if (Id !== driverId) {
        setUserDetails({});
        console.log("ride taken");
      } else {
        console.log("ride confiremmed and userDeails");
        console.log(userDetails);
        navigate(`/finalPageDriver/${userDetailsRef.current.id}`);
      }
    };
    socket.on("connect", handleConnect);
    socket.on("rideRequest", handleRideRequest);
    socket.on("lockRide", handleLockRide);

    return () => {
      socket.off("connect");
      socket.off("rideRequest", handleRideRequest);
      socket.off("lockRide", handleLockRide);
    };
  }, []);

  const registerDriver = () => {
    socket.emit("registerDriver", driverId);
  };

  const setOffline = () => {
    socket.emit("setOffline", driverId);
  };

  const driverAccept = (userId, rideId) => {
    socket.emit("driverAccept", { driverId, rideId, userId });
  };

  return { registerDriver, setOffline, driverAccept };
}
