import { Form, useActionData } from "@remix-run/react";

export default function LocationInput({
  userId,
  sourceName,
  destinationName,
  source,
  destination,
}) {
  const data = useActionData();
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
          hidden
        />
        <label htmlFor="source">Source:</label>
        <input
          type="text"
          name="sourceName"
          value={sourceName}
          readOnly
          required
        />

        <label htmlFor="destination">Destination:</label>
        <input
          type="text"
          name="destinationName"
          id=""
          value={destinationName}
          readOnly
          required
        />
      </p>
      <p>
        <button type="submit">submit</button>
      </p>
      {data && <span className="text-red-600"> {data.message}</span>}
    </Form>
  );
}
