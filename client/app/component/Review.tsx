import { Form } from "@remix-run/react";
import Rating from "./Rating";

export default function Review({ rideId }) {
  return (
    <Form method="POST" className="flex flex-col w-72 gap-3 ">
      <Rating />
      <input
        type="text"
        name="Id"
        id=""
        hidden
        defaultValue={rideId}
        readOnly
      />
      <label htmlFor="review">Review</label>
      <textarea name="review" placeholder="write a review"></textarea>
      <button type="submit" name="intent" value="review">
        Submit
      </button>
    </Form>
  );
}
