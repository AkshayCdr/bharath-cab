import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getAutoCompleteData } from "~/utils/autoComplete";
import Dropdown from "./Dropdown";
import { FaLocationCrosshairs } from "react-icons/fa6";
import useCurrLoc from "~/hooks/useGetCurrLocation";
import { getLocationName } from "~/utils/getLocationName";

export default function LocationInput({
    userId,
    sourceName,
    destinationName,
    source,
    destination,
    setSourceName,
    setDestinationName,
    setSource,
    setDestination,
}) {
    const [autoCompleteSourceData, setAutoComSource] = useState([]);
    const [isAutoCompleteSource, setIsAutoCompleteSource] = useState(false);

    const { currentLocation } = useCurrLoc();

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

    const data = useActionData();

    const navigation = useNavigation();

    const isSubmitting = navigation.state === "submitting";

    async function handleSetSourceName() {
        const [lat, long] = currentLocation;

        const name = await getLocationName(lat, long);

        setSourceName(name);
    }

    return (
        <Form method="POST" id="location-form">
            <div className="text-black m-10 flex flex-col items-center">
                <input type="hidden" name="userId" value={userId} />
                <input type="text" name="source" id="" value={source} hidden />
                <input
                    type="text"
                    name="destination"
                    id=""
                    value={destination}
                    hidden
                />
                <div className="flex flex-col gap-3 p-5">
                    <div className="flex flex-row ">
                        <input
                            type="text"
                            name="sourceName"
                            value={sourceName}
                            onChange={(e) => {
                                setSourceName(e.target.value);
                                setIsAutoCompleteSource(true);
                            }}
                            className="h-12 rounded-l-lg text-left px-4 w-56 focus:outline-none"
                            placeholder="Enter pickup location"
                            required
                        />
                        <button
                            className=" bg-white text-black p-2 rounded-r-lg "
                            onClick={() => {
                                setSource(currentLocation);
                                handleSetSourceName();
                            }}
                        >
                            <FaLocationCrosshairs />
                        </button>
                    </div>
                    <Dropdown
                        autoCompleteData={autoCompleteSourceData}
                        isAutoComplete={isAutoCompleteSource}
                        handleClick={handleClickSource}
                    />
                    <input
                        type="text"
                        name="destinationName"
                        id=""
                        value={destinationName}
                        onChange={(e) => {
                            setDestinationName(e.target.value);
                            setIsAutoCompleteDestination(true);
                        }}
                        className="h-12 rounded-lg text-left px-4 w-64 focus:outline-none"
                        placeholder="Where to?"
                        required
                    />
                    <Dropdown
                        autoCompleteData={autoCompleteDestData}
                        isAutoComplete={isAutoCompleteDestination}
                        handleClick={handleClickDestination}
                    />
                </div>
            </div>
            <div className="flex flex-col items-center">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-48 "
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "submitting...." : "submit"}
                </button>
            </div>
            {data && <span className="text-red-600"> {data.message}</span>}
        </Form>
    );
}
