import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

import { ride } from "~/apis/ride";
import { useEffect, useState } from "react";
import useLocation from "~/hooks/useLocation";
import useRideDetails, { RideDetails } from "~/hooks/useRideDetails";
import Details from "../component/Details";

import useRoute from "~/hooks/useRoute";

import Mapcontainer from "~/component/Mapcontainer";
import useRideEvents from "~/hooks/useRideEvents";
import { parse } from "~/utils/auth.server";
import { socket } from "~/socket/websocket";

function handleCancelRide(navigate) {
    alert("ride cancelled by user...");
    navigate("/driver");
}

function handleEndRide(navigate) {
    console.log("ride endd...");
    navigate("/");
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const cookies = request.headers.get("cookie");
    const userId = parse(cookies, "accountId");

    if (!userId) {
        throw redirect("/login");
    }
    const { rideId } = params;

    if (!rideId) {
        throw new Response("Not Found", { status: 404 });
    }
    const rideDetails = await ride.getRideAndUser(rideId, cookies);

    if (!rideDetails) {
        throw new Response("Not Found", { status: 404 });
    }

    return json({ rideDetails });
};

export default function FinalPageDriver() {
    const role = "driver";

    const { rideDetails } = useLoaderData<typeof loader>();

    const { source, destination, sourceName, destinationName } =
        useRideDetails(rideDetails);

    const { currentLocation } = useLocation(rideDetails.id);
    // const { distance: distanceFromDestination } = useRoute(
    //     currentLocation,
    //     destination
    // );

    const [isRideStarted, setStartRide] = useState(false);
    const [isRideEnded, setEndRide] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        socket.on("endRide", () => handleEndRide(navigate));
        socket.on("cancelRide", () => handleCancelRide(navigate));
        return () => {
            socket.off("cancelRide", handleCancelRide);
            socket.off("endRide", handleEndRide);
        };
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <h1>Loading ....</h1>;
    }
    // const { distance: distanceFromSource } = useRoute(currentLocation, source);

    // useRideEvents({ distanceFromDestination, distanceFromSource, rideDetails });

    return (
        <div className="flex flex-row m-5 p-3">
            <Details
                rideDetails={rideDetails}
                sourceName={sourceName}
                destinationName={destinationName}
                role={role}
            />
            <Mapcontainer
                source={source}
                destination={destination}
                isEditable={isEditable}
                rideLocation={currentLocation}
            ></Mapcontainer>

            {/* {isRideStarted && <p>ride started</p>}
      {isRideEnded && <p>ride ended</p>} */}
        </div>
    );
}
