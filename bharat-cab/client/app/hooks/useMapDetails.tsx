import { useEffect, useState } from "react";

export default function useMapDetails() {
    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [sourceName, setSourceName] = useState("");
    const [destinationName, setDestinationName] = useState("");
    const [isEditable, setIsEditable] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [isSourceSet, setIsSourceSet] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return {
        source,
        destination,
        setSource,
        setDestination,
        sourceName,
        setSourceName,
        destinationName,
        setDestinationName,
        isEditable,
        isMounted,
        setIsMounted,
        isSourceSet,
        setIsSourceSet,
    };
}
