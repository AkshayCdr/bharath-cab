/* eslint-disable import/no-unresolved */
import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import LocationInput from "~/component/LocationInput";
import { ride } from "~/apis/ride";

import { json } from "@remix-run/react";
import { user } from "~/apis/user";

import UserProfile from "~/component/UserProfile";

import styles from "~/styles/user.css?url";

import useUserDetails from "~/hooks/useUserDetails";
import { requireAuthCookie } from "~/utils/auth.server";

import { rideCookie } from "~/utils/rideCookie.server";

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireAuthCookie(request);

  const userData = await user.getDetails(userId);

  if (!userData) {
    throw json({ message: "Could not find user details " });
  }

  return json({ userData });
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const userId = formData.get("userId");

  const source = formData.get("source");
  const destination = formData.get("destination");

  if (!source || !destination) return { message: "select source/destination" };

  const [sourceLatitude, sourceLongitude] = source.split(",");
  const [destinationLatitude, destinationLongitude] = destination.split(",");

  const rideDetails = {
    userId,
    source: {
      longitude: parseFloat(sourceLongitude),
      latitude: parseFloat(sourceLatitude),
    },
    destination: {
      longitude: parseFloat(destinationLongitude),
      latitude: parseFloat(destinationLatitude),
    },
  };

  const rideId = await ride.setLocation(rideDetails);

  if (!rideId) {
    throw new Response("cannot get ride Id ");
  }

  return redirect(`/ride`, {
    headers: {
      "Set-Cookie": await rideCookie.serialize(rideId),
    },
  });
}

export default function User() {
  const {
    userData,
    source,
    destination,
    setSource,
    setDestination,
    sourceName,
    setSourceName,
    destinationName,
    setDestinationName,
    isEditable,
    MapComponent,
  } = useUserDetails();

  return (
    <div className="user-page flex flex-row">
      <UserProfile styles={styles} userData={userData} />
      <LocationInput
        userId={userData.account_id}
        sourceName={sourceName}
        destinationName={destinationName}
        source={source}
        destination={destination}
      />
      {MapComponent && (
        <MapComponent
          source={source}
          destination={destination}
          setSource={setSource}
          setDestination={setDestination}
          setSourceName={setSourceName}
          setDestinationName={setDestinationName}
          isEditable={isEditable}
        />
      )}
    </div>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
