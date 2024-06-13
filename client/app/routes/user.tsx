/* eslint-disable import/no-unresolved */
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import LocationInput from "~/component/LocationInput";
import { ride } from "apis/ride";
import RideDetails from "../component/RideDetails";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const locationData = Object.fromEntries(formData);
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
