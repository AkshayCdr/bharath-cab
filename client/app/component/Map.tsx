import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export default function Map({
  source,
  destination,
  setSource,
  setDestination,
  setSourceName,
  setDestinationName,
  rideLocation,
  isEditable,
}) {
  const [isSourceSet, setIsSourceSet] = useState(false);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [midpoint, setMidpoint] = useState(null);

  useEffect(() => {
    if (source && destination) {
      (async () => {
        const response = await fetch(
          `http://router.project-osrm.org/route/v1/driving/${source[1]},${source[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((coord) => [
            coord[1],
            coord[0],
          ]);
          const sourceName = await getLocationName(source[0], source[1]);
          const destinationName = await getLocationName(
            destination[0],
            destination[1]
          );
          setSourceName(sourceName);
          setDestinationName(destinationName);
          setRoute(coords);
          setDistance(data.routes[0].distance / 1000);
          setMidpoint(getRouteMidpoint(coords));
        }
      })();
    }
  }, [source, destination]);

  function ClickHandler() {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        if (!isEditable) return;
        if (!isSourceSet) {
          setSource([lat, lng]);
          const name = await getLocationName(lat, lng);
          setSourceName(name);
          setIsSourceSet(true);
        } else {
          setDestination([lat, lng]);
          const name = await getLocationName(lat, lng);
          setDestinationName(name);
          setIsSourceSet(false);
        }
      },
    });
    return null;
  }

  function getRouteMidpoint(route) {
    const midpointIndex = Math.floor(route.length / 2);
    return route[midpointIndex];
  }

  return (
    <MapContainer center={[12.971, 77.594]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler />
      {source && (
        <Marker position={source}>
          <Popup>source</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={destination}>
          <Popup>destination</Popup>
        </Marker>
      )}
      {rideLocation && (
        <Marker position={rideLocation}>
          <Popup>Driver Location</Popup>
        </Marker>
      )}
      {route.length > 0 && (
        <>
          <Polyline positions={route} color="blue" />
          {midpoint && (
            <Marker position={midpoint}>
              <Popup>Distance: {distance.toFixed(2)} km</Popup>
            </Marker>
          )}
        </>
      )}
    </MapContainer>
  );
}

async function getLocationName(lat, lon) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  );
  const data = await response.json();
  return data.display_name;
}
