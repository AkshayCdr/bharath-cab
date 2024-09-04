import { useEffect, useRef, useState } from "react";
// import { socket } from "~/socket/websocket.client";
import socketIntance from "~/socket/socketInstance.client";

export default function useLocation(rideId) {
    const rideIdRef = useRef(rideId);

    const [currentLocation, setCurrentLocation] = useState(null);
    useEffect(() => {
        const socket = socketIntance.getInstance();
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setCurrentLocation([latitude, longitude]);
                socket.emit("updateLocation", {
                    rideId: rideIdRef.current,
                    latitude,
                    longitude,
                });
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
