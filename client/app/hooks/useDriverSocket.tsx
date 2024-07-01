import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { socket } from "~/socket/websocket";

export default function useDriverSocket(driverId, setUserDetails) {
  const navigate = useNavigate();
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
        console.log("ride confirmed ");
        navigate(`/finalPageDriver/${driverId}`);
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

  const driverAccept = (userId) => {
    socket.emit("driverAccept", { driverId, userId });
  };

  return { registerDriver, setOffline, driverAccept };
}
