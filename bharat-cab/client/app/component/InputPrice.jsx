import { useEffect, useState } from "react";

const getAutoCompleteData = async (input) => {
    const data = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&filter=countrycode:auto&apiKey=55b3a098f2a1408d8d10675b02843f50`
    );

    return data.json();
};

export default function InputPrice() {
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

    const handleSeePrices = () => {
        console.log(sourceCoords);
        console.log(destCoods);
    };

    return (
        <div className="text-black flex flex-col max-w-[380px] mt-14 gap-3 ">
            <input
                type="text"
                name="source"
                onFocus={() => setIsAutoCompleteSource(true)}
                onBlur={() =>
                    setTimeout(() => setIsAutoCompleteSource(false), 100)
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
                    setTimeout(() => setIsAutoCompleteDestination(false), 100)
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

            <div className="dropdown"></div>
            <button
                onClick={handleSeePrices}
                className="text-black bg-white w-32 py-2 px-3 rounded-lg mt-4 hover:bg-slate-300 font-bold cursor-not-allowed"
            >
                See prices
            </button>
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
