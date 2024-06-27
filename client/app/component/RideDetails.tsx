import { Form } from "@remix-run/react";
import { ride } from "apis/ride";
import React from "react";

export default function RideDetails({ rideDetails }) {
  console.log(rideDetails);

  return (
    <div>
      <Form method="POST" id="ride-request-form">
        <input type="hidden" name="rideId" defaultValue={rideDetails.id} />
        <p className="ride-details-input">
          <label htmlFor="source">Source:</label>
          <input
            type="text"
            readOnly
            name="source"
            defaultValue={(rideDetails.source.x, rideDetails.source.y)}
            id=""
          />
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            name="destination"
            id=""
            readOnly
            defaultValue={
              (rideDetails.destination.x, rideDetails.destination.y)
            }
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
        <p>
          <button type="submit">Request for ride</button>
          <button type="button">Cancel</button>
        </p>
      </Form>
    </div>
  );
}
