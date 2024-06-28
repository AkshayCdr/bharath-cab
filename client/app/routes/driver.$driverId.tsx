import { socket } from "~/socket/websocket";
import {
  ActionFunctionArgs,
  LinksFunction,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";

import { useLoaderData, useNavigate } from "@remix-run/react";
import { driver } from "apis/driver";
import { useEffect, useState } from "react";
import UserDetails from "~/component/UserDetails";
import DriverProfile from "~/component/DriverProfile";

import styles from "../styles/driver.css?url";

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

export default function Driver() {
  const { driverData } = useLoaderData<typeof loader>();

  const [userDetails, setUserDetails] = useState({});
  const [online, setOnline] = useState(false);
  const [isRideAccepted, setRideAccepted] = useState(false);

  const navigate = useNavigate();
  console.log(userDetails);

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
        navigate("/finalPageDriver");
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
    setOnline(!online);
    if (online) {
      socket.emit("setOffline", driverData.account_id);
    } else {
      socket.emit("registerDriver", driverData.account_id);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    socket.emit("driverAccept", {
      driverId: driverData.account_id,
      userId: userDetails.user_id,
    });
    setRideAccepted(true);
  };
  return (
    <div className="driver-page">
      <DriverProfile driverData={driverData} />
      {Object.keys(userDetails).length > 0 && !isRideAccepted && (
        <UserDetails
          userData={userDetails}
          driverId={driverData.account_id}
          onClick={handleClick}
        />
      )}
      {!isRideAccepted && (
        <button
          onClick={goOnline}
          className={online ? "btn-gooffline" : "btn-goonline"}
        >
          {online ? "go-offline" : "go-online"}
        </button>
      )}
    </div>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
