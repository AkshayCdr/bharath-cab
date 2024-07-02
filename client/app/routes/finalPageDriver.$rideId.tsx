import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { driver } from "apis/driver";
import { ride } from "apis/ride";
import useLocation from "~/hooks/useLocation";
import { RideDetails } from "~/hooks/useRideDetails";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { rideId } = params;

  if (!rideId) {
    throw new Response("Not Found", { status: 404 });
  }
  const rideDetails: RideDetails = await ride.getRideDetails(rideId);

  if (!rideDetails) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ rideDetails });
};

export default function FinalPageDriver() {
  const { rideDetails } = useLoaderData<typeof loader>();

  const { currentLocation } = useLocation(rideDetails.id);

  return <div>finalPageDriver</div>;
}
