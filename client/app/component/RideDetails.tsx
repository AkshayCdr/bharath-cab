import { Form } from "@remix-run/react";
import React from "react";

const cities = [
  { name: "Delhi", latitude: 28.6139, longitude: 77.209 },
  { name: "Mumbai", latitude: 19.076, longitude: 72.8777 },
  { name: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
  { name: "Kolkata", latitude: 22.5726, longitude: 88.3639 },
  { name: "Chennai", latitude: 13.0827, longitude: 80.2707 },
];

export default function RideDetails({ rideDetails }) {
  console.log(rideDetails);
  const getCityNameByCoordinates = (x: number, y: number) => {
    const city = cities.find(
      (city) => city.latitude === x && city.longitude === y
    );
    return city ? city.name : "no citie";
  };

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
            id=""
            defaultValue={getCityNameByCoordinates(
              rideDetails.source.y,
              rideDetails.source.x
            )}
          />
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            name="destination"
            id=""
            readOnly
            defaultValue={getCityNameByCoordinates(
              rideDetails.destination.y,
              rideDetails.destination.x
            )}
          />
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            name="price"
            id=""
            defaultValue={rideDetails.price}
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
