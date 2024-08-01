import { redirect } from "@remix-run/react";

function clearSessionCookie(name: string) {
  return `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`;
}

export async function action() {
  return redirect("/", {
    headers: {
      "Set-Cookie": [
        clearSessionCookie("accountId"),
        clearSessionCookie("accountType"),
        clearSessionCookie("sessionId"),
      ].join(", "),
    },
  });
}
