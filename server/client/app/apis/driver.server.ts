import { config } from "../utils/config";

const API_KEY = config.API_KEY;
const DRIVER = "driver";

async function get(id: string, cookie) {
    const response = await fetch(`${API_KEY}/${DRIVER}/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
            Cookie: cookie,
        },
    });

    if (!response.ok) {
        console.error(
            "Failed to get driver data",
            response.status,
            response.statusText
        );
        return;
    }
    const driverData = await response.json();
    return driverData;
}

async function create(data) {
    const response = await fetch(`${API_KEY}/${DRIVER}/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.error(
            "Failed to set driver ",
            response.status,
            response.statusText
        );
        return;
    }
    const driverData = await response.json();
    return driverData;
}

export const driver = {
    get,
    create,
};
