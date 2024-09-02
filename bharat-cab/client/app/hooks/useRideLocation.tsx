import { useNavigate } from "@remix-run/react";
import { useEffect, useReducer } from "react";
import { socket } from "~/socket/websocket";

const actionTypes = {
    UPDATE_LOCATION: "update_location",
    RIDE_NEARBY: "ride_nearby",
    END_RIDE: "end_ride",
    START_RIDE: "start_ride",
};

const initialState = {
    rideLocation: null,
    rideId: null,
    rideStatus: "idle",
};

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_LOCATION:
            return { ...state, rideLocation: action.payload };
        case actionTypes.RIDE_NEARBY:
            return {
                ...state,
                rideId: action.payload,
                rideStatus: "nearby",
            };
        case actionTypes.END_RIDE:
            return {
                ...state,
                rideId: action.payload,
                rideStatus: "ended",
            };
        case actionTypes.START_RIDE:
            return {
                ...state,
                rideId: action.payload,
                rideStatus: "started",
            };
        default:
            return state;
    }
};

export function handleCancelRide(rideId) {
    console.log("cancelling ride");
    socket.emit("cancelRide", rideId);
}

export default function useRideLocation() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const navigate = useNavigate();

    useEffect(() => {
        const handleUpdateLocation = (locationData) => {
            const [latitude, longitude] = locationData;

            dispatch({
                type: actionTypes.UPDATE_LOCATION,
                payload: [latitude, longitude],
            });
        };

        const handleRideNearby = (rideId) => {
            console.log("ride neaby triggerd", rideId);
            dispatch({ type: actionTypes.RIDE_NEARBY, payload: rideId });
        };

        const handleEndRide = (rideId) => {
            console.log("ride end triggered", rideId);
            dispatch({ type: actionTypes.END_RIDE, payload: rideId });
            socket.disconnect();
        };

        const handleStartRide = (rideId) => {
            console.log("ride start triggered", rideId);
            dispatch({ type: actionTypes.START_RIDE, payload: rideId });
        };

        const handleRideCancel = () => {
            console.log("ride cancelled");
            navigate("/login");
        };

        socket.on("cancel", handleRideCancel);
        socket.on("updateLocation", handleUpdateLocation);
        socket.on("rideNearby", handleRideNearby);
        socket.on("endRide", handleEndRide);
        socket.on("startRide", handleStartRide);

        return () => {
            socket.off("cancel", handleRideCancel);
            socket.off("updateLocation", handleUpdateLocation);
            socket.off("rideNearby", handleRideNearby);
            socket.off("endRide", handleEndRide);
            socket.off("startRide", handleStartRide);
        };
    }, [navigate]);

    return {
        rideLocation: state.rideLocation,
        rideId: state.rideId,
        rideStatus: state.rideStatus,
    };
}
