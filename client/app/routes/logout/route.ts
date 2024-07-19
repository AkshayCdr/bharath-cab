import { redirect } from "@remix-run/react";
import { authCookie } from "~/utils/auth.server";

export async function action() {
  return redirect("/", {
    headers: {
      "Set-Cookie": await authCookie.serialize("", {
        maxAge: 0,
      }),
    },
  });
}
