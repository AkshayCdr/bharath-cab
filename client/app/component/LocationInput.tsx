import { Form } from "@remix-run/react";

const cities = [
  { name: "Delhi", latitude: 28.6139, longitude: 77.209 },
  { name: "Mumbai", latitude: 19.076, longitude: 72.8777 },
  { name: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
  { name: "Kolkata", latitude: 22.5726, longitude: 88.3639 },
  { name: "Chennai", latitude: 13.0827, longitude: 80.2707 },
];

export default function LocationInput() {
  return (
    <Form method="POST" id="location-form">
      <p>
        <label htmlFor="source">Source:</label>
        <select name="source" id="source">
          {cities.map((city) => (
            <option
              key={city.name}
              value={`${city.latitude},${city.longitude}`}
            >
              {city.name}
            </option>
          ))}
        </select>

        <label htmlFor="destination">Destination:</label>
        <select name="destination" id="destination">
          {cities.map((city) => (
            <option
              key={city.name}
              value={`${city.latitude},${city.longitude}`}
            >
              {city.name}
            </option>
          ))}
        </select>
      </p>
      <p>
        <button type="submit">submit</button>
      </p>
    </Form>
  );
}
