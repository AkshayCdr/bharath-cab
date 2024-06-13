import { ActionFunctionArgs, redirect } from "@remix-run/node";
import LocationInput from "~/component/LocationInput";
import { ride } from "apis/ride";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const locationData = Object.fromEntries(formData);
  await ride.setLocation(locationData);
  return redirect("/user");
}

export default function User() {
  return (
    <div>
      <LocationInput />
    </div>
  );
}
