import { LinksFunction, json, type LoaderFunctionArgs } from "@remix-run/node";

import { driver } from "apis/driver";

import UserDetails from "~/component/UserDetails";
import DriverProfile from "~/component/DriverProfile";

import styles from "../styles/driver.css?url";
import useDriver from "~/hooks/useDriver";
import useDriverSocket from "~/hooks/useDriverSocket";

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
  const {
    driverData,
    userDetails,
    setUserDetails,
    online,
    toggleOnline,
    isRideAccepted,
    setRideAccepted,
  } = useDriver();

  const { registerDriver, setOffline, driverAccept } = useDriverSocket(
    driverData.account_id,
    setUserDetails,
    userDetails
  );

  const goOnline = () => {
    toggleOnline();
    if (online) {
      setOffline();
    } else {
      registerDriver();
    }
  };

  const acceptRide = (e) => {
    e.preventDefault();
    driverAccept(userDetails.user_id);
    setRideAccepted(true);
  };
  return (
    <div className="driver-page">
      <DriverProfile driverData={driverData} />
      {Object.keys(userDetails).length > 0 && !isRideAccepted && (
        <UserDetails
          userData={userDetails}
          driverId={driverData.account_id}
          onClick={acceptRide}
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
