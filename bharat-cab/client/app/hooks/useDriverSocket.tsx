import { useNavigate } from "@remix-run/react";
import { useEffect, useRef } from "react";

import socketIntance from "~/socket/socketInstance.client";

export default function useDriverSocket(
    driverId,
    setUserDetails,
    userDetails,
    isOnline
) {
    const navigate = useNavigate();
    const userDetailsRef = useRef(userDetails);

    // const socket = socketIntance.getInstance();
    useEffect(() => {
        userDetailsRef.current = userDetails;
    }, [userDetails]);

    useEffect(() => {
        const handleConnect = () => {
            console.log("Socket driver connected with id:", socket.id);
        };

        const handleRideRequest = (userDetails) => {
            console.log("Received ride request:", userDetails);
            setUserDetails(userDetails);
        };

        const handleLockRide = (Id) => {
            if (Id !== driverId) {
                setUserDetails({});
                console.log("ride taken");
                return;
            }
            console.log("ride confiremmed and userDeails");
            console.log(userDetails);
            return navigate(`/finalPageDriver/${userDetailsRef.current.id}`);
        };

        const handleCancelRide = (rideId) => {
            console.log("ride id " + rideId);
            console.log("ride id from useDetails" + userDetailsRef.current.id);
            if (rideId !== userDetailsRef.current.id) return;
            setUserDetails(null);
        };
        const socket = socketIntance.getInstance();
        socket.on("connect", handleConnect);
        socket.on("rideRequest", handleRideRequest);
        socket.on("lockRide", handleLockRide);
        socket.on("cancelRide", handleCancelRide);
        return () => {
            socket.off("connect");
            socket.off("rideRequest", handleRideRequest);
            socket.off("lockRide", handleLockRide);
            socket.off("cancelRide", handleCancelRide);
        };
    }, [driverId, navigate, setUserDetails, userDetails]);

    useEffect(() => {
        const socket = socketIntance.getInstance();
        if (isOnline) {
            socket.emit("registerDriver", driverId);
        } else {
            socket.emit("setOffline", driverId);
        }
    }, [driverId, isOnline]);

    const driverAccept = (userId, rideId) => {
        const socket = socketIntance.getInstance();
        socket.emit("driverAccept", { driverId, rideId, userId });
    };

    return { driverAccept };
}
