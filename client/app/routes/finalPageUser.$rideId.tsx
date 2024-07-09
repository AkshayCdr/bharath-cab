import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { ride } from "apis/ride";
import { useEffect, useState } from "react";

import useRideDetails, { RideDetails } from "~/hooks/useRideDetails";
import useRideLocation from "~/hooks/useRideLocation";
import Details from "../component/Details";
import Review from "../component/Review";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { rideId } = params;

  if (!rideId) {
    throw new Response("Not Found", { status: 404 });
  }
  const rideDetails: RideDetails = await ride.getRideDetails(rideId);

  if (!rideDetails) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ rideDetails });
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const rideDetails = Object.fromEntries(formData);
  if (!rideDetails.review && !rideDetails.rating) {
    console.log("inside the no review or either rating");
    return { message: "add review/rating" };
  }
  if (!rideDetails.rating) {
    const updatedRideDetails = { ...rideDetails, rating: 0 };
    console.log("if there is no rating");
    console.log(updatedRideDetails);
    const message = await ride.setReview(updatedRideDetails);
    return message;
  }

  console.log("if there is rating");
  console.log(rideDetails);
  const message = await ride.setReview(rideDetails);
  console.log(message);
  return message;
  //thats it
}

export default function FinalPageUser() {
  const [isEditable, setIsEditable] = useState(false);
  const [isRideStarted, setRideStated] = useState(false);
  const [isRideEnded, setRideEnded] = useState(false);
  const {
    rideDetails,
    source,
    destination,
    MapComponent,
    sourceName,
    destinationName,
    setSource,
  } = useRideDetails();

  const { rideLocation, rideNearby, rideStatus } = useRideLocation();

  useEffect(() => {
    if (rideNearby) {
      alert("ride Nearby");
    }
  }, [rideNearby]);

  useEffect(() => {
    if (rideStatus === "started") {
      alert("ride started");
      setSource(rideLocation);
      setRideStated(true);
    }
    if (rideStatus === "ended") {
      setRideStated(false);
      alert("ride ended");
      setRideEnded(true);
      //go to rating page
    }
  }, [rideLocation, rideStatus, setSource]);

  return (
    <div className="flex flex-row m-5 p-3">
      <Details
        rideDetails={rideDetails}
        sourceName={sourceName}
        destinationName={destinationName}
      />
      {MapComponent && (
        <MapComponent
          source={source}
          destination={destination}
          isEditable={isEditable}
          rideLocation={rideLocation}
        />
      )}
      {isRideStarted && <p>Ride is started change the location</p>}
      {/* {isRideEnded && <Review rideId={rideDetails.id} />} */}
      <Review rideId={rideDetails.id} />
    </div>
  );
}
