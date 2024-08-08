import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { account } from "~/apis/account";

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

export function getCookies(request: Request) {
    return request.headers.get("Cookie");
}

export function isAuthenticated(request: Request) {
    return parse(getCookies(request), "sessionId");
}

export async function authLoader({ request }: LoaderFunctionArgs) {
    if (!isAuthenticated(request)) return null;

    const data = await account.getAccountType(getCookies(request));
    if (!data) return null;

    return redirect(`/${data.accountType}`);
}
