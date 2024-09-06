import { Form, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import Dropdown from "./Dropdown";
import { getAutoCompleteData } from "~/utils/autoComplete";

export default function RideDetails({
    rideDetails,
    sourceName,
    destinationName,
    source,
    destination,
    isLoading,
    setSourceName,
    setDestinationName,
    setSource,
    setDestination,
}) {
    const [autoCompleteSourceData, setAutoComSource] = useState([]);
    const [isAutoCompleteSource, setIsAutoCompleteSource] = useState(false);

    useEffect(() => {
        if (!sourceName) return;
        getAutoCompleteData(sourceName)
            .then(
                (result) =>
                    result?.features?.map(({ properties }) => ({
                        name: properties.formatted,
                        lon: properties.lon,
                        lat: properties.lat,
                    })) || []
            )
            .then(setAutoComSource)
            .catch(console.error);
    }, [sourceName]);

    const handleClickSource = (locData) => {
        setSourceName(locData.name);
        setSource([locData.lat, locData.lon]);
        setAutoComSource([]);
        setIsAutoCompleteSource(false);
    };

    const [autoCompleteDestData, setAutoCompleteDestData] = useState([]);
    const [isAutoCompleteDestination, setIsAutoCompleteDestination] =
        useState(false);

    useEffect(() => {
        if (!destinationName) return;
        getAutoCompleteData(destinationName)
            .then(
                (result) =>
                    result?.features?.map(({ properties }) => ({
                        name: properties.formatted,
                        lon: properties.lon,
                        lat: properties.lat,
                    })) || []
            )
            .then(setAutoCompleteDestData)
            .catch(console.error);
    }, [destinationName]);

    const handleClickDestination = (locData) => {
        setDestinationName(locData.name);
        setDestination([locData.lat, locData.lon]);
        setAutoCompleteDestData([]);
        setIsAutoCompleteDestination(false);
    };

    const [defaultSource, setDefaultSource] = useState("");
    const [defaultDestination, setDefaultDestination] = useState("");

    const navigation = useNavigation();

    const isSubmitting = navigation.state === "submitting";

    useEffect(() => {
        if (rideDetails?.source && rideDetails?.destination) {
            setDefaultSource(`${rideDetails.source.y},${rideDetails.source.x}`);
            setDefaultDestination(
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
                            className="h-12 rounded-lg text-left px-4 text-black max-w-96"
                            onChange={(e) => {
                                setSourceName(e.target.value);
                                setIsAutoCompleteSource(true);
                            }}
                        />

                        <Dropdown
                            autoCompleteData={autoCompleteSourceData}
                            isAutoComplete={isAutoCompleteSource}
                            handleClick={handleClickSource}
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
                            className="h-12 rounded-lg text-left px-4 text-black max-w-96"
                            onChange={(e) => {
                                setDestinationName(e.target.value);
                                setIsAutoCompleteDestination(true);
                            }}
                        />

                        <Dropdown
                            autoCompleteData={autoCompleteDestData}
                            isAutoComplete={isAutoCompleteDestination}
                            handleClick={handleClickDestination}
                        />
                    </div>

                    <div className="flex flex-row">
                        <label htmlFor="price" className="text-4xl mr-1">
                            ₹
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
