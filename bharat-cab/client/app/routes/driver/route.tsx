import {
    LinksFunction,
    json,
    redirect,
    type LoaderFunctionArgs,
} from "@remix-run/node";

import { driver } from "~/apis/driver.server";

import Modal from "~/component/Modal";

import styles from "~/styles/driver.css?url";
import useDriver from "~/hooks/useDriver";
import useDriverSocket from "~/hooks/useDriverSocket";

import Mapcontainer from "~/component/Mapcontainer";
import { account } from "~/apis/account.server";
import { useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const cookies = request.headers.get("cookie");

    const response = await account.getAccountId(cookies);

    if (!response?.accountId) {
        throw redirect("/login");
    }

    const driverData = await driver.get(response.accountId, cookies);

    if (!driverData)
        throw json({ message: "Could not find driver details of id " });

    return json(driverData);
};

export default function Driver() {
    const [isOnline, setIsOnline] = useState(false);

    const { driverData, userDetails, setUserDetails } = useDriver();

    const { driverAccept } = useDriverSocket(
        driverData.account_id,
        setUserDetails,
        userDetails,
        isOnline
    );

    const acceptRide = (e) => {
        e.preventDefault();
        driverAccept(userDetails.user_id, userDetails.id);
    };

    return (
        <div className="driver-page">
            <Mapcontainer></Mapcontainer>
            {userDetails && (
                <Modal
                    userData={userDetails}
                    driverId={driverData.account_id}
                    onClick={acceptRide}
                    setUserDetails={setUserDetails}
                />
            )}

            <button
                onClick={() => setIsOnline(!isOnline)}
                className={`absolute bottom-10 mx-auto left-0 right-0 z-10 w-36 h-36 rounded-full text-white font-extrabold ${
                    isOnline
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-red-500 hover:bg-red-700"
                }`}
            >
                {isOnline ? "GO OFFLINE" : "GO ONLINE"}
            </button>
        </div>
    );
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];
