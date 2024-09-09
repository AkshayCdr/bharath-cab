import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

import socketIntance from "~/socket/socketInstance.client";

export function registerClient(userId) {
    const socket = socketIntance.getInstance();
    socket.emit("registerClient", userId);
}

export default function useRideSocket({ rideDetails, setIsLoading }) {
    const navigate = useNavigate();

    console.log(rideDetails);

    // useEffect(() => {
    //     const socket = socketIntance.getInstance();
    //     socket.emit("registerClient", rideDetails.user_id);

    //     return () => {
    //         socket.off("registerClient");
    //     };
    // }, [rideDetails]);

    useEffect(() => {
        const socket = socketIntance.getInstance();
        const handleRideAccepted = (driverDetails) => {
            console.log("ride accepted by driver ", driverDetails);
            setIsLoading(false);
            navigate(`/finalPageUser/${rideDetails.id}`);
        };

        socket.on("rideAccepted", handleRideAccepted);

        return () => {
            socket.off("rideAccepted", handleRideAccepted);
        };
    }, [navigate, rideDetails.id, setIsLoading]);
}
