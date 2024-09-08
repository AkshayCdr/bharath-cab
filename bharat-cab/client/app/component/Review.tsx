import { Form } from "@remix-run/react";
import Rating from "./Rating";

export default function Review({ rideId }) {
    return (
        <Form method="POST" className="flex flex-col w-72 gap-3 m-3 p-3">
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
            <textarea
                name="review"
                placeholder="write a review"
                className="text-black rounded-lg p-2"
            ></textarea>
            <button
                type="submit"
                name="intent"
                value="review"
                className="bg-blue-700 w-32 h-9 m-auto rounded-md"
            >
                Submit
            </button>
        </Form>
    );
}
