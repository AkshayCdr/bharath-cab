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
import DriverProfile from "~/component/DriverProfile";

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

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const formData = await request.formData();

//   console.log(formData);

//   const data = Object.fromEntries(formData);
//   console.log(data);
// };

export default function Driver() {
  const { driverData } = useLoaderData<typeof loader>();

  const [userDetails, setUserDetails] = useState({});

  // navigator.geolocation.watchPosition(success,error,option);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket driver connected with id:", socket.id);
    });

    socket.on("rideRequest", (userDetails) => {
      console.log("Received ride request:", userDetails);
      setUserDetails(userDetails);
    });

    socket.on("lockRide", (driverId) => {
      if (driverId !== driverData.account_id) {
        setUserDetails({});
        console.log("ride taken");
      } else {
        console.log("ride confirmed ");
        setLocationTracking();
      }
    });

    return () => {
      socket.off("connect");
      socket.off("rideRequest");
    };
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

      <DriverProfile driverData={driverData} />
      <h1>User Details</h1>
      <UserDetails
        userData={userDetails}
        driverId={driverData.account_id}
        onClick={handleClick}
      />
    </div>
  );
}
