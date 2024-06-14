/* eslint-disable import/no-unresolved */
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import LocationInput from "~/component/LocationInput";
import { ride } from "apis/ride";
import RideDetails from "../component/RideDetails";

interface LocationData {
  source: Coordinates;
  destination: Coordinates;
}

export type Coordinates = {
  longitude?: number;
  latitude?: number;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const source = formData.get("source");
  const destination = formData.get("destination");

  if (!source || !destination) return redirect("/user");

  const [sourceLatitude, sourceLongitude] = source.split(",");
  const [destinationLatitude, destinationLongitude] = destination.split(",");

  const locationData: LocationData = {
    source: {
      longitude: parseFloat(sourceLongitude),
      latitude: parseFloat(sourceLatitude),
    },
    destination: {
      longitude: parseFloat(destinationLongitude),
      latitude: parseFloat(destinationLatitude),
    },
  };
  // const locationData = Object.fromEntries(formData);

  // console.log(locationData);
  const rideId = await ride.setLocation(locationData);
  return redirect(`/ride/${rideId}`);
}

export default function User() {
  return (
    <div>
      <LocationInput />
      <RideDetails />
    </div>
  );
}
