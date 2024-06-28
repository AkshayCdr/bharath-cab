import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { rideId } = params;
  console.log(rideId);
};

export default function finalPageUser() {
  return <div>final page user</div>;
}
