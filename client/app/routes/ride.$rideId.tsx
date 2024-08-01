/* eslint-disable import/no-unresolved */
import { useEffect, useState } from "react";
import { redirect, useActionData, useLoaderData } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { ride } from "~/apis/ride";
import RideDetails from "~/component/RideDetails";

import styles from "../styles/ride.css?url";
import useRideDetails from "~/hooks/useRideDetails";
import useRideSocket from "~/hooks/useRideSocket";

import { requireRideCookie } from "~/utils/rideCookie.server";

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
  // const rideId = await requireRideCookie(request);

  const cookies = request.headers.get("cookie");

  console.log("inside ride loader");

  const { rideId } = params;

  console.log(rideId);

  const rideDetails: Ride = await ride.getRideDetails(rideId, cookies);

  console.log(rideDetails);

  if (!rideDetails) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ rideDetails });
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  console.log("cookies from ride ");

  console.log(request.headers.get("cookie"));

  const intent = formData.get("intent");

  const isCancel = intent === "cancel";
  const isUpdate = intent === "update";
  const isRequestForRide = intent === "request-for-ride";

  const rideId = String(await requireRideCookie(request));

  console.log(rideId);

  if (isRequestForRide) {
    console.log("inside isrequest for ride");
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

    const message = await ride.updateRide({
      rideId,
      source,
      destination,
    });
    return json({ message });
  }

  if (isCancel) {
    const message = await ride.cancelRide(rideId);

    // const referer = request.headers.get("Referer");

    // // Redirect to the previous page, if the referer header is present
    // if (referer) {
    //   return redirect(referer);
    // }

    // Default redirect if referer is not present
    return redirect("/user");
    // return Navigate({ to: "/user" });
    // return json({ message });
    // return redirect("/user");
  }
  return json({ message: "error" });
}

export default function Ride() {
  const [isEditable, setIsEditable] = useState(true);
  const [isRideCancelled, setRideCancelled] = useState(false);
  const [isMounted, setMounted] = useState(false);

  const message = useActionData<typeof action>();

  console.log(message);
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
    isRideCancelled,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isMounted) {
    return <h1>Loading ....</h1>;
  }

  return (
    <div className="flex flex-row bg-gray-950 text-white min-h-screen">
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
