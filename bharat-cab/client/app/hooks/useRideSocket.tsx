import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { socket } from "~/socket/websocket";

function registerClient(rideDetails) {
    socket.emit("registerClient", rideDetails.user_id);
}

export default function useRideSocket({ rideDetails }) {
    const navigate = useNavigate();

    console.log(rideDetails);

    useEffect(() => {
        registerClient(rideDetails);
        return () => {
            socket.off("registerClient");
        };
    }, [rideDetails]);

    useEffect(() => {
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
