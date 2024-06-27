import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

export default function Map({
  source,
  destination,
  setSource,
  setDestination,
}) {
  const [isSourceSet, setIsSourceSet] = useState(false);

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
    </MapContainer>
  );
}
