import { Form } from "@remix-run/react";
import Rating from "./Rating";

export default function Review() {
  return (
    <Form method="POST" className="flex flex-col w-72 gap-3 ">
      <Rating />
      <label htmlFor="review">Review</label>
      <textarea name="review" placeholder="write a review"></textarea>
      <button>Submit</button>
    </Form>
  );
}
