import { useMapEvents } from "react-leaflet";
import { getLocationName } from "~/utils/getLocationName";

export default function useMapClickHandler({
    isEditable,
    isSourceSet,
    setSource,
    setSourceName,
    setDestination,
    setDestinationName,
    setIsSourceSet,
}) {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            if (!isEditable) return;
            if (!isSourceSet) {
                setSource([lat, lng]);
                const name = await getLocationName(lat, lng);
                setSourceName(name);
                setIsSourceSet(true);
            } else {
                setDestination([lat, lng]);
                const name = await getLocationName(lat, lng);
                setDestinationName(name);
                setIsSourceSet(false);
            }
        },
    });
}
