import { ActionFunctionArgs } from "@remix-run/node";
import { useDebugValue } from "react";
import Review from "~/component/Review";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const userDetails = Object.fromEntries(formData);
  console.log(userDetails);
}

export default function demo() {
  return <Review />;
}
