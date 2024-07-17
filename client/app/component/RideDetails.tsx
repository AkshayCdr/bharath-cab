import { Form, useNavigate } from "@remix-run/react";
import { ride } from "~/apis/ride";
import React from "react";

export default function RideDetails({
  rideDetails,
  sourceName,
  destinationName,
  handleRideCancel,
  setRideCancelled,
}) {
  console.log(rideDetails);
  const navigate = useNavigate();

  return (
    <div>
      <Form method="POST" id="ride-request-form" className="flex flex-col">
        <input type="hidden" name="rideId" defaultValue={rideDetails.id} />
        <p className="flex flex-col gap-6">
          <input
            type="text"
            readOnly
            name="source"
            defaultValue={(rideDetails.source.x, rideDetails.source.y)}
            id=""
            hidden
          />

          <input
            type="text"
            name="destination"
            id=""
            readOnly
            hidden
            defaultValue={
              (rideDetails.destination.x, rideDetails.destination.y)
            }
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
          <button type="submit">Request for ride</button>
          <button
            type="button"
            onClick={() => {
              handleRideCancel(rideDetails);
              setRideCancelled(true);
              navigate(-1);
            }}
          >
            Cancel
          </button>
        </p>
      </Form>
    </div>
  );
}
