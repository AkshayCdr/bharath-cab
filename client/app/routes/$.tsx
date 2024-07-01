import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  console.log(params);
  if (params["*"] === "log") {
    return redirect("/login");
  }
  throw new Response("Not found", { status: 404 });
};
