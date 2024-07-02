import { useEffect, useState } from "react";
import { socket } from "~/socket/websocket";

export default function useLocation(rideId) {
  const [currentLocation, setCurrentLocation] = useState([]);
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentLocation([latitude, longitude]);
        socket.emit("updateLocation", { rideId, latitude, longitude });
      },
      (error) => {
        console.log("Error getting location", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 50000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { currentLocation };
}
