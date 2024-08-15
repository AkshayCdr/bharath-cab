import { config } from "../utils/config";

const API_KEY = config.API_KEY;
const USER = "user";

export async function getDetails(id: string, cookie) {
    const response = await fetch(`${API_KEY}/${USER}/${id}`, {
        method: "GET",
        headers: {
            Cookie: cookie,
        },
        credentials: "include",
    });
    if (!response.ok) {
        console.error(
            "Failed to get users",
            response.status,
            response.statusText
        );
        return;
    }
    const userData = await response.json();

    return userData;
}

export async function create(data) {
    const response = await fetch(`${API_KEY}/${USER}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    });
    if (!response.ok) {
        console.error(
            "Failed to create user",
            response.status,
            response.statusText
        );
        return;
    }
    const userData = await response.json();

    return userData;
}

export const user = {
    getDetails,
    create,
};
