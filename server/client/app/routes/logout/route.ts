import { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { account } from "~/apis/account.server";
import { parse } from "~/utils/auth.server";

function clearSessionCookie(name: string) {
    return `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`;
}

export async function action({ request }: ActionFunctionArgs) {
    const cookies = request.headers.get("cookie");
    const id = parse(cookies, "sessionId");

    if (!id) return redirect("/");

    const response = await account.logout(id, cookies);

    console.log(response);

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
