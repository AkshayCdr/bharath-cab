/* eslint-disable import/no-unresolved */
import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import LocationInput from "~/component/LocationInput";
import { ride } from "~/apis/ride";

import { json, useLoaderData } from "@remix-run/react";
import { user } from "~/apis/user";

import styles from "~/styles/user.css?url";

import useMapDetails from "~/hooks/useMapDetails";
import { parse } from "~/utils/auth.server";

import { rideCookie } from "~/utils/rideCookie.server";

import Mapcontainer from "~/component/Mapcontainer";
import { useAuth } from "~/context/authContext";
import { useEffect } from "react";
import { commitSession, getSession } from "~/utils/session";

export interface User {
  account_id: string;
  name: string;
  email: string;
  phone: string;
}

interface LocationData {
  source: Coordinates;
  destination: Coordinates;
}

export type Coordinates = {
  longitude?: number;
  latitude?: number;
};

export function parseCoordinates(input: string) {
  const [latitude, longitude] = input.split(",").map(parseFloat);
  return { latitude, longitude };
}

export function formatSourceDestination(
  sourceInput: string,
  destinationInput: string
) {
  const isSourceOrDestinationExist = !sourceInput || !destinationInput;

  if (isSourceOrDestinationExist) return null;

  return {
    source: parseCoordinates(sourceInput),
    destination: parseCoordinates(destinationInput),
  };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookies = request.headers.get("cookie");

  const userId = parse(cookies, "accountId");

  if (!userId) {
    throw redirect("/login");
  }

  const userData = await user.getDetails(userId);

  if (!userData) {
    throw json({ message: "Could not find user details " });
  }

  return json({ userData });
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const userId = String(formData.get("userId"));

  const sourceString = String(formData.get("source"));
  const destinationString = String(formData.get("destination"));

  const data = formatSourceDestination(sourceString, destinationString);

  if (!data) {
    return { message: "select source/destination" };
  }

  const { source, destination } = data;

  const rideDetails = {
    userId,
    source,
    destination,
  };

  const rideId = await ride.setLocation(
    rideDetails,
    request.headers.get("cookie")
  );

  if (!rideId) {
    throw new Response("cannot get ride Id ");
  }

  return redirect(`/ride/${rideId}`, {
    headers: {
      "Set-Cookie": await rideCookie.serialize(rideId),
    },
  });
}

export default function User() {
  const { userData } = useLoaderData<typeof loader>();

  const { dispatch } = useAuth();

  useEffect(() => {
    dispatch({
      type: "account/login",
      payload: {
        accountId: userData.account_id,
        accountName: userData.name,
      },
    });
  }, [dispatch, userData.account_id, userData.name]);

  const {
    source,
    destination,
    setSource,
    setDestination,
    sourceName,
    setSourceName,
    destinationName,
    setDestinationName,
    isEditable,
    isMounted,
  } = useMapDetails();

  if (!isMounted) {
    return <h1>Loading ...</h1>;
  }

  return (
    <div className="flex flex-row bg-gray-950 text-white min-h-screen">
      <LocationInput
        userId={userData.account_id}
        sourceName={sourceName}
        destinationName={destinationName}
        source={source}
        destination={destination}
      />
      <div className="container w-1/2 h-screen ">
        <Mapcontainer
          source={source}
          destination={destination}
          setSource={setSource}
          setDestination={setDestination}
          setSourceName={setSourceName}
          setDestinationName={setDestinationName}
          isEditable={isEditable}
        ></Mapcontainer>
      </div>
    </div>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
