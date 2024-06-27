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
}) {
  const [isSourceSet, setIsSourceSet] = useState(false);
  const [route, setRoute] = useState([]);

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
          setRoute(coords);
        }
      })();
    }
  }, [source, destination]);

  function ClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (!isSourceSet) {
          setSource([lat, lng]);
          setIsSourceSet(true);
        } else {
          setDestination([lat, lng]);
          setIsSourceSet(false);
        }
      },
    });
    return null;
  }

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
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
      {route.length > 0 && <Polyline positions={route} color="blue" />}
    </MapContainer>
  );
}
