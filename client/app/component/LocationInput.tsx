import { Form } from "@remix-run/react";
import { useEffect } from "react";

const cities = [
  { name: "Delhi", latitude: 28.6139, longitude: 77.209 },
  { name: "Mumbai", latitude: 19.076, longitude: 72.8777 },
  { name: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
  { name: "Kolkata", latitude: 22.5726, longitude: 88.3639 },
  { name: "Chennai", latitude: 13.0827, longitude: 80.2707 },
];

export default function LocationInput({
  userId,
  sourceName,
  destinationName,
  source,
  destination,
}) {
  return (
    <Form method="POST" id="location-form">
      <p className="input-form">
        <input type="hidden" name="userId" value={userId} />
        <input type="text" name="source" id="" value={source} hidden />
        <input
          type="text"
          name="destination"
          id=""
          value={destination}
          readOnly
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
      </p>
      <p>
        <button type="submit">submit</button>
      </p>
    </Form>
  );
}
