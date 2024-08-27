import {
    LinksFunction,
    LoaderFunctionArgs,
    json,
    redirect,
} from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

import { ride } from "~/apis/ride.server";
import { useEffect, useReducer, useState } from "react";
import useLocation from "~/hooks/useLocation";
import useRideDetails, { RideDetails } from "~/hooks/useRideDetails";
import Details from "../component/Details";

import useRoute from "~/hooks/useRoute";

import Mapcontainer from "~/component/Mapcontainer";
import useRideEvents from "~/hooks/useRideEvents";

import { socket } from "~/socket/websocket";
import style from "~/styles/finalPageDriver.css?url";

// const actionTypes = {
//     RIDE_NEARBY: "rideNearby",
//     RIDE_START: "rideStart",
//     RIDE_END: "rideEnd",
// };

// const reducer = (state, action) => {
//     switch (action.type) {
//         case actionTypes.RIDE_NEARBY:
//             return { rideStatus: "rideNearby" };
//         case actionTypes.RIDE_START:
//             return { rideStatus: "rideStart" };
//         case actionTypes.RIDE_END:
//             return { rideStatus: "rideEnd" };
//     }
// };

// type initialState = { rideStatus: string };
// const initialState = {
//     rideStatus: null,
// };

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const cookies = request.headers.get("cookie");
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

    // const [state, dispatch] = useReducer(reducer, initialState);

    const [rideState, setRideState] = useState(null);

    // const [isRideStarted, setStartRide] = useState(false);
    // const [isRideEnded, setEndRide] = useState(false);

    const [isEditable, setIsEditable] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        function handleCancelRide() {
            alert("ride cancelled by user...");
            navigate("/");
        }

        // socket.on("startRide", () => setStartRide(true));
        // socket.on("endRide", () => setEndRide(true));

        socket.on("startRide", () => setRideState("rideStarted"));
        socket.on("endRide", () => setRideState("rideEnded"));

        socket.on("cancelRide", handleCancelRide);
        return () => {
            socket.off("startRide");
            socket.off("cancelRide", handleCancelRide);
            socket.off("endRide");
        };
    }, [navigate]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <h1>Loading ....</h1>;
    }
    // const { distance: distanceFromSource } = useRoute(currentLocation, source);

    // useRideEvents({ distanceFromDestination, distanceFromSource, rideDetails });

    return (
        <div className="flex flex-col lg:flex-row  p-3 bg-gray-950 text-white min-h-screen">
            <Details
                rideDetails={rideDetails}
                sourceName={sourceName}
                destinationName={destinationName}
                role={role}
                rideState={rideState}
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

export const links: LinksFunction = () => [{ rel: "stylesheet", href: style }];
