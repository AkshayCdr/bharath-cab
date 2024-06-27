/* eslint-disable import/no-unresolved */
import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import LocationInput from "~/component/LocationInput";
import { ride } from "apis/ride";

import { json, useLoaderData } from "@remix-run/react";
import { user } from "apis/user";

import UserProfile from "~/component/UserProfile";

import styles from "../styles/user.css?url";
import Map from "~/component/Map";

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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { userId } = params;

  if (!userId) {
    throw new Response("Not Found", { status: 404 });
  }

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

  if (!source || !destination) return redirect("/user");

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

  return redirect(`/ride/${rideId}`);
}

export default function User() {
  const { userData } = useLoaderData<typeof loader>();
  return (
    <div className="user-page">
      <UserProfile styles={styles} userData={userData} />
      <LocationInput userId={userData.account_id} />
      <Map />
    </div>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
