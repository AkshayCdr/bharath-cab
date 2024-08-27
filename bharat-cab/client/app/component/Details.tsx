import { Form, useNavigate, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { socket } from "~/socket/websocket";

export default function RideDetails({
    rideDetails,
    sourceName,
    destinationName,
    role,
    rideState,
    setRideState,
}) {
    const [isOtpValLoading, setOtpValLoading] = useState(false);
    const [otp, setOtp] = useState(null);
    const [isOtpValidated, setOtpValidated] = useState(false);
    const [otpErrMssg, setOtpErrMssg] = useState(null);

    const isRideStarted = rideState === "started";
    const isRideEnded = rideState === "ended";
    const isOnRide = rideState === "onride";

    console.log(rideDetails);

    const isDriver = role === "driver";
    const isUser = role === "user";

    const navigation = useNavigation();
    const navigate = useNavigate();

    const isSubmitting = navigation.state !== "idle";

    function handleRideStart(e, rideId) {
        e.preventDefault();

        socket.emit("rideStartDriver", rideId);
        setRideState("onride");
    }

    useEffect(() => {
        function handleOtpValSucc() {
            setOtpValidated(true);
            setOtpValLoading(false);

            setOtpErrMssg(false);
        }

        function handleOtpValFail() {
            setOtpValLoading(false);
            setOtpErrMssg("otp error");
        }

        socket.on("otpValSuccess", handleOtpValSucc);
        socket.on("otpValFailure", handleOtpValFail);

        return () => {
            socket.off("otpValSuccess");
        };
    }, []);

    function handleValidateOtp(e, rideId) {
        e.preventDefault();

        if (!otp) return;

        setOtpValLoading(true);
        socket.emit("otpValidate", { otp, rideId });
    }

    function handleRideEnd(e, rideId) {
        e.preventDefault();
        socket.emit("rideEndDriver", rideId);
        return navigate("/");
    }

    return (
        <Form method="post" className="flex flex-col m-4 p-2 ">
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
                        $
                    </label>
                    <input
                        type="text"
                        name="price"
                        id=""
                        value={rideDetails.price}
                        readOnly
                        className="bg-gray-950 font-extrabold text-4xl w-10"
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

                {isDriver && isRideStarted && !isOtpValidated && (
                    <div className="flex flex-col gap-4">
                        <input
                            type="number"
                            name="otp"
                            min={1000}
                            max={9999}
                            placeholder="Enter 4 digit pin"
                            onChange={(e) => setOtp(e.target.value)}
                            className="text-black"
                            required
                        />

                        <button
                            onClick={(e) =>
                                handleValidateOtp(e, rideDetails.id)
                            }
                            className="bg-green-600 w-32 h-9 m-auto rounded-md"
                        >
                            {isOtpValLoading
                                ? "Validating ..."
                                : "Validate otp"}
                        </button>
                        {otpErrMssg && (
                            <div className="text-red-500">{otpErrMssg}</div>
                        )}
                        {isOtpValLoading && <div>Loading...</div>}
                    </div>
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

                {isDriver && isOtpValidated && !isOnRide && (
                    <button
                        className="bg-green-600 w-32 h-9 m-auto rounded-md"
                        onClick={(e) => handleRideStart(e, rideDetails.id)}
                    >
                        Start Ride
                    </button>
                )}

                {isOnRide && isDriver && (
                    <button
                        onClick={(e) => handleRideEnd(e, rideDetails.id)}
                        className="bg-green-600 w-32 h-9 m-auto rounded-md"
                    >
                        End Ride
                    </button>
                )}

                {!isRideStarted && !isOnRide && !isRideEnded && (
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
