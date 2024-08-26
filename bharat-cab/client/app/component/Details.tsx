import { Form, useNavigation } from "@remix-run/react";
import { socket } from "~/socket/websocket";

function handleRideStart(rideId) {
    socket.emit("rideStartDriver", rideId);
}
function handleRideEnd(rideId) {
    socket.emit("rideEndDriver", rideId);
}

export default function RideDetails({
    rideDetails,
    sourceName,
    destinationName,
    role,
    isRideStarted,
    isRideEnded,
}) {
    console.log(rideDetails);
    const isDriver = role === "driver";
    const isUser = role === "user";

    const navigation = useNavigation();

    const isSubmitting = navigation.state !== "idle";

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

                {isRideStarted && (
                    <button
                        onClick={() => handleRideStart(rideDetails.id)}
                        className="bg-green-600 w-32 h-9 m-auto rounded-md"
                    >
                        Start Ride
                    </button>
                )}
                {isRideEnded && (
                    <button
                        onClick={() => handleRideEnd(rideDetails.id)}
                        className="bg-green-600 w-32 h-9 m-auto rounded-md"
                    >
                        End Ride
                    </button>
                )}

                {!isRideStarted && (
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
