import { Form, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { FaLocationCrosshairs, FaSpinner } from "react-icons/fa6";
import Dropdown from "./Dropdown";
import { getAutoCompleteData } from "~/utils/autoComplete";
import useCurrLoc from "~/hooks/useGetCurrLocation";
import { getLocationName } from "~/utils/getLocationName";
import { registerClient } from "~/hooks/useRideSocket";

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
    isSourceSet,
    setIsSourceSet,
}) {
    const [autoCompleteSourceData, setAutoComSource] = useState([]);
    const [isAutoCompleteSource, setIsAutoCompleteSource] = useState(false);

    useEffect(() => {
        if (!sourceName) return;
        let ignore = false;
        getAutoCompleteData(sourceName)
            .then(
                (result) =>
                    result?.features?.map(({ properties }) => ({
                        name: properties.formatted,
                        lon: properties.lon,
                        lat: properties.lat,
                    })) || []
            )
            .then((result) => {
                if (!ignore) setAutoComSource(result);
            })
            .catch(console.error);
        return () => {
            ignore = true;
        };
    }, [sourceName]);

    const handleClickSource = (locData) => {
        setSourceName(locData.name);
        setSource([locData.lat, locData.lon]);
        setAutoComSource([]);
        setIsAutoCompleteSource(false);
        setIsSourceSet(true);
    };

    const [autoCompleteDestData, setAutoCompleteDestData] = useState([]);
    const [isAutoCompleteDestination, setIsAutoCompleteDestination] =
        useState(false);

    useEffect(() => {
        if (!destinationName) return;
        let ignore = false;
        getAutoCompleteData(destinationName)
            .then(
                (result) =>
                    result?.features?.map(({ properties }) => ({
                        name: properties.formatted,
                        lon: properties.lon,
                        lat: properties.lat,
                    })) || []
            )
            .then((result) => {
                if (!ignore) setAutoCompleteDestData(result);
            })
            .catch(console.error);
        return () => {
            ignore = true;
        };
    }, [destinationName]);

    const handleClickDestination = (locData) => {
        setDestinationName(locData.name);
        setDestination([locData.lat, locData.lon]);
        setAutoCompleteDestData([]);
        setIsAutoCompleteDestination(false);
        setIsSourceSet(false);
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

    async function handleSetSourceName(e) {
        e.preventDefault();
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setSource([latitude, longitude]);
                const name = await getLocationName(latitude, longitude);
                console.log(name);
                setSourceName(name);
                setIsSourceSet(false);
            },
            (err) => {
                console.log(err);
                console.log("error getting data");
            },
            {
                enableHighAccuracy: true,
            }
        );
    }

    return (
        <div className="">
            <Form
                method="POST"
                id="ride-request-form"
                className="m-10 flex flex-col items-center"
                onSubmit={() => registerClient(rideDetails.user_id)}
            >
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
                        <div className="flex flex-row">
                            <input
                                type="text"
                                name="sourceName"
                                value={sourceName}
                                className="h-12 rounded-l-lg text-left px-4 text-black md:w-[350px] lg:w-56 focus:outline-none"
                                onChange={(e) => {
                                    setSourceName(e.target.value);
                                    setIsAutoCompleteSource(true);
                                }}
                                onBlur={() =>
                                    setTimeout(
                                        () => setIsAutoCompleteSource(false),
                                        1000
                                    )
                                }
                                autoComplete="off"
                            />
                            <button
                                className=" bg-white text-black p-2 rounded-r-lg "
                                onClick={handleSetSourceName}
                            >
                                <FaLocationCrosshairs />
                            </button>
                        </div>

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
                            className="h-12 rounded-lg text-left px-4 text-black md:w-96 lg:w-64 focus:outline-none"
                            onBlur={() =>
                                setTimeout(
                                    () => setIsAutoCompleteDestination(false),
                                    1000
                                )
                            }
                            autoComplete="off"
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
                    <div className="flex flex-row gap-1">
                        <button
                            type="submit"
                            name="intent"
                            value="update"
                            disabled={isSubmitting}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[110px] "
                        >
                            Update
                        </button>
                        <button
                            type="submit"
                            name="intent"
                            value="cancel"
                            disabled={isSubmitting}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-[110px] "
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Form>
        </div>
    );
}
