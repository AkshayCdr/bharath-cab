import { useEffect, useState } from "react";
import { useNavigation } from "@remix-run/react";
import { useFetcher } from "react-router-dom";
import { config } from "~/utils/config";
import Svg from "~/component/Svg";
import { getAutoCompleteData } from "~/utils/autoComplete";
import Dropdown from "./Dropdown";

export default function InputPrice() {
    const fetcher = useFetcher();

    const navigation = useNavigation();

    const isSubmitting = navigation.state !== "idle";

    const { distance, price } = fetcher.data || [];

    console.log(price);
    useEffect(() => {
        if (price || distance) {
            setModalVisible(true);
        }
    }, [price, distance]);

    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");

    const [sourceCoords, setSourceCoords] = useState([]);
    const [destCoods, setDestCoords] = useState([]);

    const [autoCompleteSourceData, setAutoComSource] = useState([]);
    const [isAutoCompleteSource, setIsAutoCompleteSource] = useState(false);

    const [autoCompleteDestData, setAutoCompleteDestData] = useState([]);
    const [isAutoCompleteDestination, setIsAutoCompleteDestination] =
        useState(false);

    const [isModalVisible, setModalVisible] = useState(false);

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

    const handleSubmit = () => {
        if (!sourceCoords.length || !destCoods.length) return;
        setModalVisible(true);
    };

    return (
        <div className="text-black flex flex-col max-w-[380px] mt-14 gap-3 ">
            <div className="text-white">
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
                    className="h-12 rounded-lg text-left px-4 w-80 text-black focus:outline-none"
                    placeholder="Enter location"
                    autoComplete="off"
                    value={source}
                />

                <Dropdown
                    autoCompleteData={autoCompleteSourceData}
                    isAutoComplete={isAutoCompleteSource}
                    handleClick={handleClickSource}
                />
            </div>

            <div>
                <input
                    type="text"
                    name="destination"
                    onFocus={() => setIsAutoCompleteDestination(true)}
                    onBlur={() =>
                        setTimeout(
                            () => setIsAutoCompleteDestination(false),
                            1000
                        )
                    }
                    onChange={(e) => {
                        setDestination(e.target.value);
                        setIsAutoCompleteDestination(true);
                    }}
                    className="h-12 rounded-lg text-left px-4 w-80 focus:outline-none"
                    placeholder="Enter destination"
                    autoComplete="off"
                    value={destination}
                />

                <Dropdown
                    autoCompleteData={autoCompleteDestData}
                    isAutoComplete={isAutoCompleteDestination}
                    handleClick={handleClickDestination}
                />
            </div>

            <fetcher.Form method="post" onSubmit={handleSubmit}>
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
            {isModalVisible && (
                <Modal
                    price={price}
                    distance={distance}
                    isSubmitting={isSubmitting}
                    setModalVisible={setModalVisible}
                />
            )}
        </div>
    );
}

//if isSubmitting ? -> svg -> distance && distance

function Modal({ price, distance, isSubmitting, setModalVisible }) {
    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
            className="fixed inset-0 h-full w-full bg-gray-950 bg-opacity-90"
            onClick={() => setModalVisible(false)}
        >
            <div className="fixed  left-1/2 top-1/2  transform -translate-x-1/2 -translate-y-1/2 ">
                <div className="relative flex flex-col bg-yellow-50 justify-center items-center rounded-lg h-[500px] w-[750px] ">
                    <div className="flex flex-col gap-4 items-center border-2 border-black p-20 rounded-lg h-[300px] justify-center">
                        <div className="flex gap-4 items-center ">
                            <span className="text-6xl font-extrabold">
                                Distance{" "}
                            </span>

                            {distance ? (
                                <div className="flex flex-row gap-2 items-end">
                                    <span className="text-5xl font-bold text-blue-700 border-b-2 border-b-gray-400 ">
                                        {distance}
                                    </span>
                                    <span className="font-bold text-base ">
                                        Km
                                    </span>
                                </div>
                            ) : (
                                <div className="flex w-28 h-28 justify-center items-center">
                                    <Svg />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className="text-6xl font-extrabold border-b-2 border-b-gray-400 text-blue-700">
                                ₹
                            </span>

                            {price ? (
                                <span className="text-5xl font-bold">
                                    {price}
                                </span>
                            ) : (
                                <div className="flex w-28 h-28 justify-center items-center">
                                    <Svg />
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        className="absolute bottom-8 border-2 border-black px-6 py-1 rounded-lg hover:text-white hover:bg-black font-bold"
                        onClick={() => setModalVisible(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
