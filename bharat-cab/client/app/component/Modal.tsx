import { useEffect, useReducer, useRef, useState } from "react";
import { getLocationName } from "~/utils/getLocationName";

export default function Modal({ userData, driverId, onClick, setUserDetails }) {
    console.log(userData);
    const [sourceName, setSourceName] = useState(null);
    const [destinationName, setDestinationName] = useState(null);

    const modalRef = useRef<HTMLDivElement>();

    function handleClickOutside(event) {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setUserDetails(null);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        (async () => {
            if (userData) {
                const source = await getLocationName(
                    userData?.source.x,
                    userData?.source.y
                );
                const destination = await getLocationName(
                    userData?.destination.x,
                    userData?.destination.y
                );
                setSourceName(source);
                setDestinationName(destination);
            }
        })();
    }, [userData]);

    return (
        <div
            ref={modalRef}
            className="container bg-white max-w-md absolute m-auto left-0 right-0 bottom-1/3 rounded-2xl shadow-md"
        >
            <input type="hidden" name="driverId" defaultValue={driverId} />
            <input type="hidden" name="userId" defaultValue={userData.id} />
            <div className="">
                <div className="flex justify-center text-4xl gap-2 p-3 m-2">
                    <div>Rs.</div>
                    <div>{userData?.price}</div>
                </div>
                <div className="m-4 p-4 border-l-4 border-black">
                    {sourceName && (
                        <div className="text-lg border-b-4 border-black ">
                            {sourceName}
                        </div>
                    )}
                    {destinationName && (
                        <div className="text-lg">{destinationName}</div>
                    )}
                </div>
            </div>
            <div className="flex justify-center m-2 p-2">
                <button
                    className="bg-black text-white hover:bg-gray-700 font-bold py-2 px-4 rounded-lg"
                    type="submit"
                    onClick={onClick}
                >
                    Accept Ride
                </button>
            </div>
        </div>
    );
}
