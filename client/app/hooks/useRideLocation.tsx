import { useEffect, useState } from "react";
import { socket } from "~/socket/websocket";

export default function useRideLocation() {
  const [rideLocation, setRideLocation] = useState(null);
  useEffect(() => {
    const handleUpdateLocation = (locationData) => {
      const [latitude, longitude] = locationData;
      setRideLocation([latitude, longitude]);
    };

    const handleRideNearby = () => {};

    const handleEndRide = () => {};

    const handleStartRide = () => {};

    socket.on("updateLocation", handleUpdateLocation);
    socket.on("rideNearby", handleRideNearby);
    socket.on("endRide", handleEndRide);
    socket.on("startRide", handleStartRide);

    return () => {
      socket.off("updateLocation", handleUpdateLocation);
      socket.off("driverNearby", handleRideNearby);
      socket.off("endRide", handleEndRide);
      socket.off("startRide", handleStartRide);
    };
  }, []);
  return { rideLocation };
}
