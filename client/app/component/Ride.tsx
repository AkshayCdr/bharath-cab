import { Form } from "@remix-run/react";
import { ride } from "~/apis/ride";
import React from "react";

export default function RideDetails({
  rideDetails,
  sourceName,
  destinationName,
}) {
  console.log(rideDetails);

  return (
    <div className="flex flex-col">
      <Form method="POST" id="ride-request-form">
        <input type="hidden" name="rideId" defaultValue={rideDetails.id} />
        <p className="ride-details-input flex flex-col">
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
          <label htmlFor="source">Source:</label>
          <input type="text" name="sourceName" value={sourceName} readOnly />
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            name="destinationName"
            id=""
            value={destinationName}
            readOnly
          />
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            name="price"
            id=""
            value={rideDetails.price}
            readOnly
          />
        </p>
      </Form>
    </div>
  );
}
