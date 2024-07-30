import { createCookie } from "@remix-run/node";
import { redirect } from "@remix-run/react";

export const parse = (header: string, type: string) => {
  if (!header) return null;
  return header
    .split(",")
    .map((ele) =>
      ele
        .split(";")
        .map((ele) => ele.split("="))
        .filter((ele) => ele[0].trim() === type)
    )
    .flat()
    .flat()[1]
    .trim();
};
export const getHeaderCookie = (session, type) => {
  if (!session) return null;
  return session
    .split(";")
    .map((ele) => ele.split("="))
    .filter((ele) => ele[0].trim() === type)
    .flat()[1];
};

export function getAccountIdFromSession(request) {
  const session = request.headers.get("cookie");
  console.log(session);
  const accountId = getHeaderCookie(session, "accountId");
  if (!accountId) return null;
  return accountId;
}

export function requireSession(request) {
  const accountId = getAccountIdFromSession(request);

  if (!accountId) {
    throw redirect("/login");
  }
}

const secret = "default";

export const authCookie = createCookie("auth", {
  path: "/",
  sameSite: "lax",
  // httpOnly: true,
  // secure: true,
  secrets: [secret],
  // expires: new Date(Date.now() + 60_000),
  maxAge: 86400,
});

export async function requireAuthCookie(request: Request) {
  const cookieString = request.headers.get("Cookie");
  const accountId = await authCookie.parse(cookieString);

  if (!accountId) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await authCookie.serialize(",", {
          maxAge: 0,
        }),
      },
    });
  }
  return accountId;
}

export async function isLoggedIn(request: Request) {
  const cookieString = request.headers.get("Cookie");
  console.log(cookieString);
  const accountId = await authCookie.parse(cookieString);
  console.log(accountId);
  // if(accountId) return redirect('/')
  // return accountId;
}
