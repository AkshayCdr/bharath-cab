import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { driver } from "apis/driver";
import { useEffect } from "react";
import { socket } from "~/socket/websocket";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { driverId } = params;

  console.log(driverId);
  if (!driverId) {
    throw new Response("Not Found", { status: 404 });
  }

  const driverData = await driver.get(driverId);

  console.log(driverData);

  if (!driverData)
    throw json({ message: "Could not find driver details of id " });

  return json(driverData);
};

export default function FinalPageDriver() {
  const { driverData } = useLoaderData<typeof loader>();

  useEffect(() => {
    setLocationTracking();
  }, []);

  const setLocationTracking = () => {
    navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        socket.emit("updateLocation", { driverData, latitude, longitude });
      },
      (error) => {
        console.log("eroor getting location", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 50000,
      }
    );
  };

  return <div>finalPageDriver</div>;
}
