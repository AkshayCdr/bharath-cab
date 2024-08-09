import { config } from "../utils/config";

const API_KEY = config.API_KEY;
const SESSION = "session";

async function login(userDetails) {
    const response = await fetch(`${API_KEY}/${SESSION}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
        credentials: "include",
    });

    if (!response.ok) return null;

    return response;
}

async function logout(id, cookie) {
    const response = await fetch(`${API_KEY}/${SESSION}/${id}`, {
        method: "DELETE",
        headers: {
            Cookie: cookie,
        },
        credentials: "include",
    });

    if (!response.ok) return null;

    return response;
}

async function getAccountType(cookie) {
    const response = await fetch(`${API_KEY}/${SESSION}/account-type`, {
        method: "GET",
        headers: {
            Cookie: cookie,
        },
        credentials: "include",
    });

    if (!response.ok) return null;

    const accountType = await response.json();

    if (!accountType) return null;

    return accountType;
}

async function getAccountId(cookie) {
    const response = await fetch(`${API_KEY}/${SESSION}/account-id`, {
        method: "GET",
        headers: {
            Cookie: cookie,
        },
        credentials: "include",
    });

    if (!response.ok) return null;

    return response.json();
}

export const account = {
    login,
    logout,
    getAccountType,
    getAccountId,
};
