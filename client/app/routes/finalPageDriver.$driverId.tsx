import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { driver } from "apis/driver";
import useLocation from "~/hooks/useLocation";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { driverId } = params;

  if (!driverId) {
    throw new Response("Not Found", { status: 404 });
  }

  const driverData = await driver.get(driverId);

  if (!driverData)
    throw json({ message: "Could not find driver details of id " });

  return json(driverData);
};

export default function FinalPageDriver() {
  const { driverData } = useLoaderData<typeof loader>();
  const { currentLocation } = useLocation(driverData);

  console.log(currentLocation);
  return <div>finalPageDriver</div>;
}
