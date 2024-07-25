import { useState } from "react";

export default function useMapDetails() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [isEditable, setIsEditable] = useState(true);

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
  };
}
