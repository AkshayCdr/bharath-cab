import { useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { DiAndroid } from "react-icons/di";

import { useFetcher } from "react-router-dom";

const getAutoCompleteData = async (input) => {
    const data = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&filter=countrycode:auto&apiKey=55b3a098f2a1408d8d10675b02843f50`
    );

    return data.json();
};

export default function InputPrice() {
    const fetcher = useFetcher();

    const { distance, price } = fetcher.data || [];

    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");

    const [sourceCoords, setSourceCoords] = useState([]);
    const [destCoods, setDestCoords] = useState([]);

    const [autoCompleteSourceData, setAutoComSource] = useState([]);
    const [isAutoCompleteSource, setIsAutoCompleteSource] = useState(false);

    const [autoCompleteDestData, setAutoCompleteDestData] = useState([]);
    const [isAutoCompleteDestination, setIsAutoCompleteDestination] =
        useState(false);

    const handleClickSource = (locData) => {
        setSource(locData.name);
        setSourceCoords([locData.lat, locData.lon]);
        setAutoComSource([]);
        setIsAutoCompleteSource(false);
    };

    useEffect(() => {
        if (!source) return;
        getAutoCompleteData(source)
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
    }, [source]);

    const handleClickDestination = (locData) => {
        setDestination(locData.name);
        setDestCoords([locData.lat, locData.lon]);
        setAutoCompleteDestData([]);
        setIsAutoCompleteDestination(false);
    };

    useEffect(() => {
        if (!destination) return;
        getAutoCompleteData(destination)
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
    }, [destination]);

    // const priceSubmitHandler = (e) => {
    //     e.preventDefault();
    //     const formData = new FormData(e.currentTarget);
    //     const source = formData
    //         .get("source-coords")
    //         ?.toString()
    //         .split(",")
    //         .map((ele) => parseFloat(ele));

    //     const destination = formData
    //         .get("destination-coords")
    //         ?.toString()
    //         .split(",")
    //         .map((ele) => parseFloat(ele));

    //     getDistance(source, destination)
    //         .then((res) => console.log(res))
    //         .catch((err) => console.error(err));
    // };

    return (
        <div className="text-black flex flex-col max-w-[380px] mt-14 gap-3 ">
            <input
                type="text"
                name="source"
                onFocus={() => setIsAutoCompleteSource(true)}
                onBlur={() =>
                    setTimeout(() => setIsAutoCompleteSource(false), 1000)
                }
                onChange={(e) => {
                    setSource(e.target.value);
                    setIsAutoCompleteSource(true);
                }}
                className="h-12 rounded-lg text-left px-4"
                placeholder="Enter location"
                value={source}
            />

            <Dropdown
                autoCompleteData={autoCompleteSourceData}
                isAutoComplete={isAutoCompleteSource}
                handleClick={handleClickSource}
            />

            <input
                type="text"
                name="destination"
                onFocus={() => setIsAutoCompleteDestination(true)}
                onBlur={() =>
                    setTimeout(() => setIsAutoCompleteDestination(false), 1000)
                }
                onChange={(e) => {
                    setDestination(e.target.value);
                    setIsAutoCompleteDestination(true);
                }}
                className="h-12 rounded-lg text-left px-4"
                placeholder="Enter destination"
                value={destination}
            />

            <Dropdown
                autoCompleteData={autoCompleteDestData}
                isAutoComplete={isAutoCompleteDestination}
                handleClick={handleClickDestination}
            />
            {price && <Modal price={price} distance={distance} />}

            <fetcher.Form method="post">
                <input
                    type="hidden"
                    name="source-coords"
                    value={sourceCoords}
                />
                <input
                    type="hidden"
                    name="destination-coords"
                    value={destCoods}
                />
                <button
                    type="submit"
                    className="text-black bg-white w-32 py-2 px-3 rounded-lg mt-4 hover:bg-slate-300 font-bold "
                >
                    See prices
                </button>
            </fetcher.Form>
        </div>
    );
}

function Dropdown({ autoCompleteData, isAutoComplete, handleClick }) {
    return (
        <div>
            {isAutoComplete && autoCompleteData.length > 0 && (
                <div className="dropdown">
                    <ul>
                        {autoCompleteData.map((loc, ind) => (
                            <li className="dropdown-list" key={ind}>
                                <button onClick={() => handleClick(loc)}>
                                    {loc.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function Modal({ price, distance }) {
    console.log(price);
    return (
        <div className="text-white">
            Price is {price} distance is {distance}
        </div>
    );
}
