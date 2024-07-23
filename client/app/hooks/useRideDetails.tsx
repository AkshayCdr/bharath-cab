import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { loader } from "~/routes/ride.$rideId";
import { getLocationName } from "~/utils/getLocationName";

export interface RideDetails {
  id: string;
  source: Coordinates;
  destination: Coordinates;
  price: string;
  user_id: string;
}

type Coordinates = {
  x?: number;
  y?: number;
};

export default function useRideDetails() {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [MapComponent, setMapComponent] = useState(null);
  const [sourceName, setSourceName] = useState(null);
  const [destinationName, setDestinationName] = useState(null);
  const { rideDetails } = useLoaderData<typeof loader>();
  useEffect(() => {
    (async () => {
      if (rideDetails) {
        setSource([rideDetails.source.y, rideDetails.source.x]);
        setDestination([rideDetails.destination.y, rideDetails.destination.x]);
        const source = await getLocationName(
          rideDetails.source.y,
          rideDetails.source.x
        );
        const destination = await getLocationName(
          rideDetails.destination.y,
          rideDetails.destination.x
        );
        setSourceName(source);
        setDestinationName(destination);
      }
    })();
  }, [rideDetails]);

  useEffect(() => {
    import("../component/Map.client").then((module) =>
      setMapComponent(() => module.default)
    );
  }, []);

  return {
    rideDetails,
    source,
    destination,
    setSource,
    setDestination,
    MapComponent,
    sourceName,
    destinationName,
    setSourceName,
    setDestinationName,
  };
}
