import { useEffect, useState } from "react";

export default function InputPrice() {
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");

    const [sourceCoords, setSourceCoords] = useState([]);
    const [destCoods, setDestCoords] = useState([]);

    const [autoComSource, setAutoComSource] = useState([]);

    const handleClickSource = (locData) => {
        setSource(locData.name);
        setSourceCoords([locData.lat, locData.lon]);
        setAutoComSource([]);
    };

    useEffect(() => {
        if (!source) return;
        fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${source}&filter=countrycode:auto&apiKey=55b3a098f2a1408d8d10675b02843f50`
        )
            .then((res) => res.json())
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

    return (
        <div className="text-black flex flex-col max-w-[380px] mt-14 gap-3 ">
            <input
                type="text"
                name="source"
                onChange={(e) => setSource(e.target.value)}
                className="h-12 rounded-lg text-left px-4"
                placeholder="Enter location"
                value={source}
            />

            <div className="dropdown">
                <ul>
                    {autoComSource.map((loc, ind) => (
                        <li
                            className="dropdown-list"
                            key={ind}
                            onClick={() => handleClickSource(loc)}
                        >
                            {loc.name}
                        </li>
                    ))}
                </ul>
            </div>

            <input
                type="text"
                name="destination"
                onChange={(e) => setDestination(e.target.value)}
                className="h-12 rounded-lg text-left px-4"
                placeholder="Enter destination"
            />
            <div className="dropdown"></div>
            <button className="text-black bg-white w-32 py-2 px-3 rounded-lg mt-4 hover:bg-slate-300 font-bold cursor-not-allowed">
                See prices
            </button>
        </div>
    );
}
