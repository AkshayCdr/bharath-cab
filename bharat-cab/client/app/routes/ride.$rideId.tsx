/* eslint-disable import/no-unresolved */
import { useEffect, useState } from "react";
import { redirect, useActionData, useLoaderData } from "@remix-run/react";
import {
    ActionFunctionArgs,
    json,
    LinksFunction,
    LoaderFunctionArgs,
} from "@remix-run/node";
import { ride } from "~/apis/ride.server";
import RideDetails from "~/component/RideDetails";

import styles from "../styles/ride.css?url";
import useRideDetails from "~/hooks/useRideDetails";
import useRideSocket from "~/hooks/useRideSocket";

import { formatSourceDestination } from "./user/route";

import Mapcontainer from "~/component/Mapcontainer";

export interface Ride {
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

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const cookies = request.headers.get("cookie");
    const { rideId } = params;

    const rideDetails: Ride = await ride.getRideDetails(rideId, cookies);

    if (!rideDetails) {
        throw new Response("Not Found", { status: 404 });
    }

    return json({ rideDetails });
};

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    console.log("cookies from ride ");

    const intent = formData.get("intent");

    const isCancel = intent === "cancel";
    const isUpdate = intent === "update";
    const isRequestForRide = intent === "request-for-ride";

    const rideId = String(formData.get("rideId"));

    if (isRequestForRide) {
        const message = await ride.requestForRide(
            rideId,
            request.headers.get("cookie")
        );

        return json({ message });
    }

    if (isUpdate) {
        const sourceString = String(formData.get("source"));
        const destinationString = String(formData.get("destination"));

        const data = formatSourceDestination(sourceString, destinationString);

        console.log(data);

        if (!data) {
            return { message: "select source/destination" };
        }

        const { source, destination } = data;

        const message = await ride.updateRide(
            {
                rideId,
                source,
                destination,
            },
            request.headers.get("cookie")
        );
        return json({ message });
    }

    if (isCancel) {
        const message = await ride.cancelRide(
            rideId,
            request.headers.get("cookie")
        );

        return redirect("/user");
    }
    return json({ message: "error" });
}

export default function Ride() {
    const [isEditable, setIsEditable] = useState(true);
    const [isRideCancelled, setRideCancelled] = useState(false);
    const [isMounted, setMounted] = useState(false);

    const message = useActionData<typeof action>();

    const { rideDetails } = useLoaderData<typeof loader>();
    const {
        source,
        destination,
        setSource,
        setDestination,
        sourceName,
        destinationName,
        setSourceName,
        setDestinationName,
    } = useRideDetails(rideDetails);

    useRideSocket({
        rideDetails,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isMounted) {
        return <h1>Loading ....</h1>;
    }

    return (
        <div className="flex flex-col lg:flex-row bg-gray-950 text-white min-h-screen">
            <div className="flex flex-col">
                <RideDetails
                    rideDetails={rideDetails}
                    sourceName={sourceName}
                    destinationName={destinationName}
                    source={source}
                    destination={destination}
                />
                {message && <p className="text-green-800">{message.message}</p>}
            </div>

            <Mapcontainer
                source={source}
                destination={destination}
                setSource={setSource}
                setDestination={setDestination}
                setSourceName={setSourceName}
                setDestinationName={setDestinationName}
                isEditable={isEditable}
            />
        </div>
    );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
