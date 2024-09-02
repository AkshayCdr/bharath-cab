import { Form, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";

export default function RideDetails({
    rideDetails,
    sourceName,
    destinationName,
    source,
    destination,
    isLoading,
}) {
    const [defaultSource, setSource] = useState("");
    const [defaultDestination, setDestination] = useState("");

    const navigation = useNavigation();

    const isSubmitting = navigation.state === "submitting";

    useEffect(() => {
        if (rideDetails?.source && rideDetails?.destination) {
            setSource(`${rideDetails.source.y},${rideDetails.source.x}`);
            setDestination(
                `${rideDetails.destination.y},${rideDetails.destination.x}`
            );
        }
    }, [rideDetails]);

    return (
        <div>
            <Form method="POST" id="ride-request-form" className="m-10 ">
                <p className="flex flex-col gap-6">
                    <input
                        type="text"
                        name="rideId"
                        value={rideDetails.id}
                        hidden
                    />
                    <input
                        type="text"
                        readOnly
                        name="source"
                        defaultValue={defaultSource}
                        value={source}
                        id=""
                        hidden
                    />

                    <input
                        type="text"
                        name="destination"
                        id=""
                        readOnly
                        hidden
                        defaultValue={defaultDestination}
                        value={destination}
                    />

                    <div className="flex flex-col">
                        <label htmlFor="source" className="text-2xl">
                            Source
                        </label>
                        <input
                            type="text"
                            name="sourceName"
                            value={sourceName}
                            readOnly
                            className="h-12 rounded-lg text-left px-4 text-black max-w-96"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="destination" className="text-2xl">
                            Destination
                        </label>
                        <input
                            type="text"
                            name="destinationName"
                            id=""
                            value={destinationName}
                            readOnly
                            className="h-12 rounded-lg text-left px-4 text-black max-w-96"
                        />
                    </div>

                    <div className="flex flex-row">
                        <label htmlFor="price" className="text-4xl mr-1">
                            $
                        </label>
                        <div>
                            {rideDetails?.price && (
                                <div className="text-4xl">
                                    {rideDetails.price}
                                </div>
                            )}
                        </div>
                        {/* <input
              type="text"
              name="price"
              id=""
              value={rideDetails.price}
              readOnly
              className="h-12 rounded-lg text-left px-4"
            /> */}
                    </div>
                </p>
                <div className="flex flex-col gap-4 m-4 justify-items-center">
                    <button
                        type="submit"
                        name="intent"
                        value="request-for-ride"
                        disabled={isSubmitting || isLoading}
                        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-56 ${
                            isLoading || isSubmitting
                                ? "cursor-not-allowed opacity-500 flex justify-end"
                                : ""
                        }`}
                    >
                        {isSubmitting || isLoading ? (
                            <FaSpinner className="animate-spin text" />
                        ) : (
                            "Request for ride"
                        )}
                    </button>
                    <div>
                        <button
                            type="submit"
                            name="intent"
                            value="update"
                            disabled={isSubmitting}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-28 "
                        >
                            Update
                        </button>
                        <button
                            type="submit"
                            name="intent"
                            value="cancel"
                            disabled={isSubmitting}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-28 "
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    );
}
