import { ActionFunctionArgs, redirect } from "@remix-run/node";
import LocationInput from "~/component/LocationInput";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const locationData = Object.entries(formData);
  //get source and destination
  //set source and destination
  console.log(locationData);
  return redirect("/user");
}

export default function User() {
  return (
    <div>
      <LocationInput />
    </div>
  );
}
