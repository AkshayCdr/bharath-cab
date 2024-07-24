/* eslint-disable import/no-unresolved */
import { useState } from "react";
import {
  Navigate,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { ride } from "~/apis/ride";
import RideDetails from "~/component/RideDetails";

import DriverDetails from "~/component/DriverDetails";

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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const intent = formData.get("intent");

  const isCancel = intent === "cancel";
  const isUpdate = intent === "update";
  const isRequestForRide = intent === "request-for-ride";

  const rideId = String(await requireRideCookie(request));

  if (isRequestForRide) {
    const message = await ride.requestForRide(rideId);
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
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const rideId = await requireRideCookie(request);

  const rideDetails: Ride = await ride.getRideDetails(rideId);

  if (!rideDetails) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ rideDetails });
};

export default function Ride() {
  const [isEditable, setIsEditable] = useState(true);
  const [isRideCancelled, setRideCancelled] = useState(false);

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

  const { isRideAccepted, driverDetails } = useRideSocket({
    rideDetails,
    isRideCancelled,
  });

  return (
    <div className="flex flex-row">
      <p className="flex flex-col">
        <RideDetails
          rideDetails={rideDetails}
          sourceName={sourceName}
          destinationName={destinationName}
          source={source}
          destination={destination}
        />
        {isRideAccepted ? (
          <DriverDetails driverDetails={driverDetails} />
        ) : (
          message && <p className="ride-message">{message.message}</p>
        )}
      </p>

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
