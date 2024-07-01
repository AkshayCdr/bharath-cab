import { useEffect, useState } from "react";
import { socket } from "~/socket/websocket";

export default function useRideLocation() {
  const [rideLocation, setRideLocation] = useState(null);
  useEffect(() => {
    const handleUpdateLocation = (locationData) => {
      const [latitude, longitude] = locationData;
      setRideLocation([latitude, longitude]);
    };

    socket.on("updateLocation", handleUpdateLocation);

    return () => {
      socket.off("updateLocation", handleUpdateLocation);
    };
  }, []);
  return { rideLocation };
}
