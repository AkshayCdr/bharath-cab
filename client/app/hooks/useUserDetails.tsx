import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { loader } from "~/routes/user.$userId/route";

export default function useUserDetails() {
  const { userData } = useLoaderData<typeof loader>();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [isEditable, setIsEditable] = useState(true);

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
  };
}
