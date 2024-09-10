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

export default function useRideDetails(rideDetails) {
    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [sourceName, setSourceName] = useState(null);
    const [destinationName, setDestinationName] = useState(null);
    const [isSourceSet, setIsSourceSet] = useState(false);

    useEffect(() => {
        (async () => {
            if (rideDetails) {
                setSource([rideDetails.source.x, rideDetails.source.y]);
                setDestination([
                    rideDetails.destination.x,
                    rideDetails.destination.y,
                ]);
                const source = await getLocationName(
                    rideDetails.source.x,
                    rideDetails.source.y
                );
                const destination = await getLocationName(
                    rideDetails.destination.x,
                    rideDetails.destination.y
                );
                setSourceName(source);
                setDestinationName(destination);
            }
        })();
    }, [rideDetails]);

    return {
        source,
        destination,
        setSource,
        setDestination,
        sourceName,
        destinationName,
        setSourceName,
        setDestinationName,
        isSourceSet,
        setIsSourceSet,
    };
}
