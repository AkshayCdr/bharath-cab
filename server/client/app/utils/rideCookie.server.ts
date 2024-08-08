import { createCookie, redirect } from "@remix-run/node";

export const rideCookie = createCookie("ride", {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: true,
  // secrets: [secret],
  // expires: new Date(Date.now() + 60_000),
  maxAge: 60,
});

export async function requireRideCookie(request: Request) {
  const cookieString = request.headers.get("Cookie");
  const rideId = await rideCookie.parse(cookieString);
  if (!rideId) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await rideCookie.serialize(",", {
          maxAge: 0,
        }),
      },
    });
  }
  return rideId;
}
