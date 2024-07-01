import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { loader } from "~/routes/ride.$rideId";

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
  const { rideDetails } = useLoaderData<typeof loader>();
  useEffect(() => {
    if (rideDetails) {
      setSource([rideDetails.destination.y, rideDetails.destination.x]);
      setDestination([rideDetails.source.y, rideDetails.source.x]);
    }
  }, [rideDetails]);

  useEffect(() => {
    import("../component/Map").then((module) =>
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
  };
}
