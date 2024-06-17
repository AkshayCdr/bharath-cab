import { socket } from "~/socket/websocket";
import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";

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

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const formData = await request.formData();

//   console.log(formData);

//   const data = Object.fromEntries(formData);
//   console.log(data);
// };

export default function Driver() {
  const { driverData } = useLoaderData<typeof loader>();

  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket driver connected with id:", socket.id);
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

  const handleClick = (e) => {
    e.preventDefault();
    console.log("clicked", e);
    socket.emit("driverAccept", {
      driverId: driverData.account_id,
      userId: userDetails.user_id,
    });
  };
  return (
    <div>
      <button onClick={goOnline}>goOnline</button>
      <ul key={driverData.account_id}>
        <li>{driverData.name}</li>
      </ul>
      <h1>User Details</h1>
      <UserDetails
        userData={userDetails}
        driverId={driverData.account_id}
        onClick={handleClick}
      />
    </div>
  );
}
