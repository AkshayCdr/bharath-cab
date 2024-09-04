import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
// import { socket } from "~/socket/websocket.client";
// import socket from "~/socket/socket.client";

import socketIntance from "~/socket/socketInstance.client";

function registerClient(rideDetails) {
    const socket = socketIntance.getInstance();
    socket.emit("registerClient", rideDetails.user_id);
}

export default function useRideSocket({ rideDetails }) {
    const navigate = useNavigate();

    console.log(rideDetails);

    useEffect(() => {
        const socket = socketIntance.getInstance();
        registerClient(rideDetails);
        return () => {
            socket.off("registerClient");
        };
    }, [rideDetails]);

    useEffect(() => {
        const socket = socketIntance.getInstance();
        const handleRideAccepted = (driverDetails) => {
            console.log("ride accepted by driver ", driverDetails);
            navigate(`/finalPageUser/${rideDetails.id}`);
        };

        socket.on("rideAccepted", handleRideAccepted);

        return () => {
            socket.off("rideAccepted", handleRideAccepted);
        };
    }, [navigate, rideDetails.id]);
}
