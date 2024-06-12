import { Form } from "@remix-run/react";

export default function LocationInput() {
  return (
    <Form method="POST" id="location-form">
      <p>
        <input type="text" name="source" id="source" placeholder="source" />
        <input
          type="text"
          name="destination"
          id="destination"
          placeholder="destination"
        />
      </p>
      <p>
        <button type="submit">submit</button>
      </p>
    </Form>
  );
}
