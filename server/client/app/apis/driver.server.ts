import { config } from "../utils/config";

const API_KEY = config.API_KEY;
const RIDE = "driver";

async function get(id: string, cookie) {
    const response = await fetch(`${API_KEY}/${RIDE}/${id}`, {
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

export const driver = {
    get,
};
