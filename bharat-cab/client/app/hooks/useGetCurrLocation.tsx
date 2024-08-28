import { useEffect, useState } from "react";

export default function useCurrLoc() {
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setCurrentLocation([latitude, longitude]);
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
