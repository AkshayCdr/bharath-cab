import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

import { ride } from "~/apis/ride";
import { useState } from "react";
import useLocation from "~/hooks/useLocation";
import useRideDetails, { RideDetails } from "~/hooks/useRideDetails";
import Details from "../component/Details";

import useRoute from "~/hooks/useRoute";

import Mapcontainer from "~/component/Mapcontainer";
import useRideEvents from "~/hooks/useRideEvents";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { rideId } = params;

  if (!rideId) {
    throw new Response("Not Found", { status: 404 });
  }
  const rideDetails = await ride.getRideAndUser(
    rideId,
    request.headers.get("cookie")
  );

  if (!rideDetails) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ rideDetails });
};

export default function FinalPageDriver() {
  const [isRideStarted, setStartRide] = useState(false);
  const [isRideEnded, setEndRide] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const role = "driver";

  const { rideDetails } = useLoaderData<typeof loader>();

  const { source, destination, sourceName, destinationName } =
    useRideDetails(rideDetails);

  const { currentLocation } = useLocation(rideDetails.id);

  const { distance: distanceFromSource } = useRoute(currentLocation, source);

  const { distance: distanceFromDestination } = useRoute(
    currentLocation,
    destination
  );

  useRideEvents({ distanceFromDestination, distanceFromSource, rideDetails });

  // useEffect(() => {
  //   function handleCancelRide(rideId) {
  //     if (rideId !== rideDetails.id) return;
  //     navigate("/driver");
  //   }
  //   socket.on("cancelRide", handleCancelRide);
  //   return () => {
  //     socket.off("cancelRide", handleCancelRide);
  //   };
  // }, []);

  return (
    <div className="flex flex-row m-5 p-3">
      <Details
        rideDetails={rideDetails}
        sourceName={sourceName}
        destinationName={destinationName}
        role={role}
      />
      <Mapcontainer
        source={source}
        destination={destination}
        isEditable={isEditable}
        rideLocation={currentLocation}
      ></Mapcontainer>

      {/* {isRideStarted && <p>ride started</p>}
      {isRideEnded && <p>ride ended</p>} */}
    </div>
  );
}
