import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import useRoute from "~/hooks/useRoute";
import useMapClickHandler from "~/hooks/useMapClickHandler";

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

  const getCenter = () => {
    if (rideLocation) return rideLocation;
    if (midpoint) return midpoint;
    return [12.971, 77.594];
  };

  return (
    <MapContainer
      center={getCenter()}
      zoom={13}
      scrollWheelZoom={false}
      className="z-0 "
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler />
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
