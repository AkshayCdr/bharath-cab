import { Form } from "@remix-run/react";
import Rating from "./Rating";

export default function Review() {
  return (
    <Form method="POST">
      <Rating />
      <label htmlFor="review">Review</label>
      <textarea name="review" placeholder="write a review"></textarea>
      <button>Submit</button>
    </Form>
  );
}
