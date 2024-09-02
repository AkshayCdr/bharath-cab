import { Form, useNavigate, useNavigation } from "@remix-run/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { socket } from "~/socket/websocket";

function handleRideStart(e, rideId, setRideState) {
    e.preventDefault();
    socket.emit("rideStartDriver", rideId);
    setRideState("onride");
}

function handleRideEnd(e, rideId, navigate) {
    e.preventDefault();
    socket.emit("rideEndDriver", rideId);
    return navigate("/login");
}

const initialState = {
    status: "not validated",
    error: null,
};

enum otpStates {
    NOT_VALIDATED = "not validated",
    VALIDATING = "validating",
    VALIDATED = "validated",
    ERROR = "err",
}

enum rideStates {
    STARTED = "started",
    ENDED = "ended",
    ONRIDE = "onride",
    NEARBY = "nearby",
    IDLE = "idle",
}

function otpReducer(state, action) {
    switch (action.type) {
        case otpStates.VALIDATING:
            return { ...state, status: "validating", error: null };
        case otpStates.VALIDATED:
            return { ...state, status: "validated", error: null };
        case otpStates.ERROR:
            return { ...state, status: "err", error: action.payload };
        default:
            return state;
    }
}

export default function RideDetails({
    rideDetails,
    sourceName,
    destinationName,
    role,
    rideState,
    setRideState,
}) {
    const [state, dispatch] = useReducer(otpReducer, initialState);

    const isOtpLoading = state.status === otpStates.VALIDATING;
    const isOtpVal = state.status === otpStates.VALIDATED;
    const otpErr = state.status === otpStates.ERROR;

    const isOtpNotValidated =
        state.status === otpStates.ERROR || otpStates.NOT_VALIDATED;

    const otp = useRef(null);

    const isRideStarted = rideState === rideStates.STARTED;
    const isRideEnded = rideState === rideStates.ENDED;
    const isOnRide = rideState === rideStates.ONRIDE;
    const isRideIdle = rideState === rideStates.IDLE;

    console.log(rideDetails);

    const isDriver = role === "driver";
    const isUser = role === "user";

    const navigation = useNavigation();
    const navigate = useNavigate();

    const isSubmitting = navigation.state !== "idle";

    useEffect(() => {
        function handleOtpValSucc() {
            dispatch({ type: otpStates.VALIDATED });
        }

        function handleOtpValFail() {
            dispatch({ type: otpStates.ERROR, payload: "otp eroor" });
        }

        socket.on("otpValSuccess", handleOtpValSucc);
        socket.on("otpValFailure", handleOtpValFail);

        return () => {
            socket.off("otpValSuccess");
            socket.off("otpValFailure");
        };
    }, []);

    function handleValidateOtp(e, rideId) {
        e.preventDefault();
        if (!otp.current.value) return;
        dispatch({ type: otpStates.VALIDATING });
        socket.emit("otpValidate", { otp: otp.current.value, rideId });
    }

    return (
        <Form method="post">
            <input type="hidden" name="rideId" defaultValue={rideDetails.id} />
            <p className="ride-details-input flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="source " className="text-2xl font-bold ">
                        Source
                    </label>
                    <input
                        type="text"
                        name="sourceName"
                        value={sourceName}
                        readOnly
                        className="bg-gray-950 border-b-2"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="destination"
                        className="text-2xl font-bold mb-"
                    >
                        Destination
                    </label>
                    <input
                        type="text"
                        name="destinationName"
                        id=""
                        value={destinationName}
                        readOnly
                        className="bg-gray-950 border-b-2"
                    />
                </div>
                <div className="flex gap-2">
                    <label htmlFor="price" className="text-4xl">
                        ₹
                    </label>
                    <input
                        type="text"
                        name="price"
                        id=""
                        value={rideDetails.price}
                        readOnly
                        className="bg-gray-950 font-extrabold text-4xl w-28"
                    />
                </div>

                <div className="flex flex-col">
                    {isDriver && (
                        <label htmlFor="driver" className="text-2xl font-bold">
                            Driver
                        </label>
                    )}
                    {isUser && (
                        <label htmlFor="user" className="text-2xl font-bold">
                            User
                        </label>
                    )}

                    <input
                        type="text"
                        name={isDriver ? "driver" : " user"}
                        id=""
                        value={rideDetails.name}
                        readOnly
                        className="bg-gray-950 "
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="phone" className="text-2xl font-bold">
                        Phone
                    </label>
                    <input
                        type="text"
                        name="phone"
                        id=""
                        value={rideDetails.phone}
                        readOnly
                        className="bg-gray-950 "
                    />
                </div>

                {isDriver &&
                    isRideStarted &&
                    isOtpNotValidated &&
                    !isOtpVal && (
                        <div className="flex flex-col gap-4">
                            <input
                                type="number"
                                name="otp"
                                min={1000}
                                max={9999}
                                placeholder="Enter 4 digit pin"
                                ref={otp}
                                className="bg-gray-950"
                                required
                            />

                            <button
                                onClick={(e) =>
                                    handleValidateOtp(e, rideDetails.id)
                                }
                                className="bg-green-600 w-32 h-9 m-auto rounded-md"
                            >
                                {isOtpLoading
                                    ? "Validating ..."
                                    : "Validate otp"}
                            </button>
                            {otpErr && (
                                <div className="text-red-500">Invalid otp</div>
                            )}
                            {isOtpLoading && <div>Loading...</div>}
                        </div>
                    )}

                {isDriver && isOtpVal && isRideStarted && (
                    <button
                        className="bg-green-600 w-32 h-9 m-auto rounded-md"
                        onClick={(e) =>
                            handleRideStart(e, rideDetails.id, setRideState)
                        }
                    >
                        Start Ride
                    </button>
                )}

                {isUser && (
                    <div className="flex flex-col">
                        <label htmlFor="pin" className="text-2xl font-bold">
                            Pin
                        </label>
                        <input
                            type="text"
                            name="pin"
                            id=""
                            value={rideDetails.pin}
                            readOnly
                            className="bg-gray-950 "
                        />
                    </div>
                )}

                {isDriver && isRideEnded && (
                    <button
                        onClick={(e) =>
                            handleRideEnd(e, rideDetails.id, navigate)
                        }
                        className="bg-green-600 w-32 h-9 m-auto rounded-md"
                    >
                        End Ride
                    </button>
                )}

                {isRideIdle && (
                    <button
                        type="submit"
                        name="intent"
                        value="cancel"
                        className="bg-red-700 w-32 h-9 m-auto rounded-md"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "cancelling... " : "cancel"}
                    </button>
                )}
            </p>
        </Form>
    );
}
