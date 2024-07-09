import { ActionFunctionArgs } from "@remix-run/node";
import { useDebugValue } from "react";
import Review from "~/component/Review";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const userDetails = Object.fromEntries(formData);
  console.log(userDetails);
  if (!userDetails.review && !userDetails.rating) {
    //send to data to rating
    console.log("inside the no review or either rating");
    return;
  }
  //send data to backend
  //thats it
}

export default function demo() {
  return <Review />;
}
