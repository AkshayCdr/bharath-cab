import {
    MapContainer,
    Marker,
    Polyline,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import useRoute from "~/hooks/useRoute";
import useMapClickHandler from "~/hooks/useMapClickHandler";
import L from "leaflet";
import { FaLocationCrosshairs } from "react-icons/fa6";

import { Icon } from "public/Icons/icons";
import useCurrLoc from "~/hooks/useGetCurrLocation";

export default function Map({
    source,
    destination,
    setSource,
    setDestination,
    setSourceName,
    setDestinationName,
    isEditable,
    rideLocation,
    isRideStarted,
}) {
    const [isSourceSet, setIsSourceSet] = useState(false);

    const { route, distance, midpoint } = useRoute(source, destination);

    const { route: rideRoute } = useRoute(rideLocation, destination);

    const [userLocation, setUserLocation] = useState(null);

    const { currentLocation } = useCurrLoc();

    const [center, setCenter] = useState([12.971, 77.594]);

    function ClickHandler() {
        useMapClickHandler({
            isEditable,
            isSourceSet,
            setSource,
            setSourceName,
            setDestination,
            setDestinationName,
            setIsSourceSet,
        });
        return null;
    }

    function MapCenterHandler() {
        const map = useMap();

        useEffect(() => {
            if (center) {
                map.setView(center);
            }
        }, [map]);

        return null;
    }

    useEffect(() => {
        if (rideLocation) {
            setCenter(rideLocation);
        } else if (source && destination) {
            const middle = [
                (source[0] + destination[0]) / 2,
                (source[1] + destination[1]) / 2,
            ];

            setCenter(middle);
        } else if (source) {
            setCenter(source);
        } else if (destination) {
            setCenter(destination);
        } else if (userLocation) {
            setCenter(userLocation);
        } else {
            return;
        }
    }, [destination, source, rideLocation, userLocation]);

    const bounds = L.latLngBounds(
        [12.7343, 77.3662], // Southwest coordinates (lat, lng)
        [13.1737, 77.853] // Northeast coordinates (lat, lng))
    );

    return (
        <div className="">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                className="z-0 "
                bounds={bounds}
                maxBounds={bounds}
                maxBoundsViscosity={1.0}
                minZoom={12}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ClickHandler />
                <MapCenterHandler />

                {userLocation && (
                    <Marker position={userLocation} icon={Icon.currLocation}>
                        <Popup>Location</Popup>
                    </Marker>
                )}

                {source && (
                    <Marker position={source} icon={Icon.source}>
                        <Popup>source</Popup>
                    </Marker>
                )}
                {destination && (
                    <Marker position={destination} icon={Icon.destination}>
                        <Popup>destination</Popup>
                    </Marker>
                )}
                {rideLocation && (
                    <Marker position={rideLocation} icon={Icon.car}>
                        <Popup>Driver Location</Popup>
                    </Marker>
                )}
                {!isRideStarted && route.length > 0 && (
                    <Polyline positions={route} color="blue" weight={5} />
                )}

                {isRideStarted && rideRoute.length > 0 && (
                    <Polyline positions={rideRoute} color="red" weight={5} />
                )}
            </MapContainer>
            <button
                className="text-4xl absolute z-[1000] bottom-7 right-7 text-black bg-white rounded-lg p-2"
                onClick={() => setUserLocation(currentLocation)}
            >
                <FaLocationCrosshairs />
            </button>
        </div>
    );
}
