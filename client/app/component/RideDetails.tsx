import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function RideDetails({
  rideDetails,
  sourceName,
  destinationName,
  source,
  destination,
}) {
  const [defaultSource, setSource] = useState("");
  const [defaultDestination, setDestination] = useState("");

  useEffect(() => {
    if (rideDetails?.source && rideDetails?.destination) {
      setSource(`${rideDetails.source.y},${rideDetails.source.x}`);
      setDestination(
        `${rideDetails.destination.y},${rideDetails.destination.x}`
      );
    }
  }, [rideDetails]);
  return (
    <div>
      <Form method="POST" id="ride-request-form" className="flex flex-col">
        <p className="flex flex-col gap-6">
          <input
            type="text"
            readOnly
            name="source"
            defaultValue={defaultSource}
            value={source}
            id=""
            hidden
          />

          <input
            type="text"
            name="destination"
            id=""
            readOnly
            hidden
            defaultValue={defaultDestination}
            value={destination}
          />

          <div className="flex flex-col">
            <label htmlFor="source" className="text-2xl">
              Source:
            </label>
            <input type="text" name="sourceName" value={sourceName} readOnly />
          </div>
          <div className="flex flex-col">
            <label htmlFor="destination" className="text-2xl">
              Destination:
            </label>
            <input
              type="text"
              name="destinationName"
              id=""
              value={destinationName}
              readOnly
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="price">Price:</label>
            <input
              type="text"
              name="price"
              id=""
              value={rideDetails.price}
              readOnly
            />
          </div>
        </p>
        <p>
          <button type="submit" name="intent" value="request-for-ride">
            Request for ride
          </button>
          <button type="submit" name="intent" value="cancel">
            Cancel
          </button>
          <button type="submit" name="intent" value="update">
            Update
          </button>
        </p>
      </Form>
    </div>
  );
}
