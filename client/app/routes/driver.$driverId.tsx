import { socket } from "~/socket/websocket";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

import { useLoaderData } from "@remix-run/react";
import { driver } from "apis/driver";
import { useEffect, useState } from "react";
import UserDetails from "~/component/UserDetails";

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

export default function Driver() {
  const { driverData } = useLoaderData<typeof loader>();

  // function goOnline() {
  //   socket.on("registerDriver", driverData.account_id);
  // }

  // socket.on("rideRequest", (userDetails) => {
  //   console.log(userDetails);
  // });

  // socket.on("connect", () => {
  //   console.log(socket.id);
  // });

  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected with id:", socket.id);
    });

    socket.on("rideRequest", (userDetails) => {
      console.log("Received ride request:", userDetails);
      setUserDetails(userDetails);
    });

    return () => {
      socket.off("connect");
      socket.off("rideRequest");
    };
  }, []);

  const goOnline = () => {
    socket.emit("registerDriver", driverData.account_id);
  };
  return (
    <div>
      <button onClick={goOnline}>goOnline</button>
      <ul key={driverData.account_id}>
        <li>{driverData.name}</li>
      </ul>
      <h1>User Details</h1>
      {/* <p>{userDetails ? <p>{userDetails.name}</p> : "no user"}</p> */}
      <ul key={userDetails.id}>
        <li>{userDetails.name}</li>
        <li>{userDetails.phone}</li>
      </ul>
    </div>
  );
}
