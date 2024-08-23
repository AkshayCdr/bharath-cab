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

import { Icon } from "public/Icons/icons";

export default function Map({
    source,
    destination,
    setSource,
    setDestination,
    setSourceName,
    setDestinationName,
    isEditable,
    rideLocation,
}) {
    const [isSourceSet, setIsSourceSet] = useState(false);

    const { route, distance, midpoint } = useRoute(source, destination);

    const [userLocation, setUserLocation] = useState(null);

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

    function Locate() {
        const map = useMap();

        const handleLocate = (e) => {
            e.stopPropagating();
            console.log("locate clicked");
            if (!navigator.geolocation) return;

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;

                    console.log("setting user location");
                    setUserLocation([latitude, longitude]);

                    map.setView([latitude, longitude], 14);
                },
                (err) => {
                    console.log("eroor getting pos");
                    console.error(err.message);
                }
            );
        };

        return (
            <button
                onClick={handleLocate}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 1000,
                    padding: "8px 12px",
                    backgroundColor: "black",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                {" "}
                location
            </button>
        );
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
        } else {
            return;
        }
    }, [destination, source, rideLocation]);

    const bounds = L.latLngBounds(
        [12.7343, 77.3662], // Southwest coordinates (lat, lng)
        [13.1737, 77.853] // Northeast coordinates (lat, lng))
    );

    return (
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

            <Locate />

            {userLocation && (
                <Marker position={userLocation} icon={Icon.source}>
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
            {route.length > 0 && (
                <>
                    <Polyline positions={route} color="blue" weight={5} />
                    {midpoint && (
                        <Marker position={midpoint} icon={Icon.distance}>
                            <Popup>Distance: {distance.toFixed(2)} km</Popup>
                        </Marker>
                    )}
                </>
            )}
        </MapContainer>
    );
}
