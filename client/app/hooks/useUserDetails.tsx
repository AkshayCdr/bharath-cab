import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { loader } from "~/routes/user.$userId/route";

export default function useUserDetails() {
  const { userData } = useLoaderData<typeof loader>();

  const [MapComponent, setMapComponent] = useState(null);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    import("../component/Map").then((module) =>
      setMapComponent(() => module.default)
    );
  });
  return {
    userData,
    source,
    destination,
    setSource,
    setDestination,
    sourceName,
    setSourceName,
    destinationName,
    setDestinationName,
    isEditable,
    MapComponent,
  };
}
