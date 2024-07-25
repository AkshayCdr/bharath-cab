import { LinksFunction, json, type LoaderFunctionArgs } from "@remix-run/node";

import { driver } from "~/apis/driver";

import Modal from "~/component/Modal";

import styles from "~/styles/driver.css?url";
import useDriver from "~/hooks/useDriver";
import useDriverSocket from "~/hooks/useDriverSocket";
import { requireAuthCookie } from "~/utils/auth.server";

import Mapcontainer from "~/component/Mapcontainer";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const driverId = await requireAuthCookie(request);

  if (!driverId) {
    throw new Response("Not Found", { status: 404 });
  }

  const driverData = await driver.get(driverId);

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
    driverAccept(userDetails.user_id, userDetails.id);
    setRideAccepted(true);
  };
  return (
    <div className="driver-page">
      <Mapcontainer></Mapcontainer>
      {Object.keys(userDetails).length > 0 && !isRideAccepted && (
        <Modal
          userData={userDetails}
          driverId={driverData.account_id}
          onClick={acceptRide}
        />
      )}
      {!isRideAccepted && (
        <button
          onClick={goOnline}
          className={`absolute bottom-10 right-1/2 z-10 w-20 h-24 rounded-3xl ${
            online ? "bg-blue-600" : "bg-red-500"
          }`}
        >
          {online ? "go-offline" : "go-online"}
        </button>
      )}
    </div>
  );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
