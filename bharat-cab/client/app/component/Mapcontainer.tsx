import type { LinksFunction } from "@remix-run/node";
import leafletStyles from "leaflet/dist/leaflet.css?url";
import { ClientOnly } from "remix-utils/client-only";

import Map from "./Map.client";

export const links: LinksFunction = () => [
    {
        rel: "stylesheet",
        href: leafletStyles,
    },
];

export default function Mapcontainer({
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
    return (
        <ClientOnly
            fallback={
                <div
                    id="skeleton"
                    style={{ height: "400px", background: "#d1d1d1" }}
                />
            }
        >
            {() => (
                <Map
                    source={source}
                    destination={destination}
                    setSource={setSource}
                    setDestination={setDestination}
                    setSourceName={setSourceName}
                    setDestinationName={setDestinationName}
                    isEditable={isEditable}
                    rideLocation={rideLocation}
                    isRideStarted={isRideStarted}
                />
            )}
        </ClientOnly>
    );
}
