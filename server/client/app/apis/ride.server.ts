import { config } from "../utils/config";

const API_KEY = config.API_KEY;
const RIDE = "ride";

async function setLocation(locationData, cookie) {
    const response = await fetch(`${API_KEY}/${RIDE}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookie,
        },
        body: JSON.stringify(locationData),
        credentials: "include",
    });
    if (!response.ok) {
        console.error(
            "Failed to set location",
            response.status,
            response.statusText
        );
        return;
    }
    const { rideId } = await response.json();

    return rideId;
}

async function getRideDetails(rideId: string, cookie) {
    const response = await fetch(`${API_KEY}/${RIDE}/${rideId}`, {
        headers: {
            Cookie: cookie,
        },
        method: "GET",
        credentials: "include",
    });
    if (!response.ok) {
        console.error(response.status, response.statusText);
        return;
    }
    const data = await response.json();

    return data;
}

async function getRideAndDriver(rideId: string, cookie) {
    const response = await fetch(`${API_KEY}/${RIDE}/${rideId}/driver`, {
        method: "GET",
        credentials: "include",
        headers: {
            Cookie: cookie,
        },
    });
    if (!response.ok) {
        console.error(response.status, response.statusText);
        return;
    }
    const data = await response.json();

    return data;
}

async function getRideAndUser(rideId: string, cookie) {
    const response = await fetch(`${API_KEY}/${RIDE}/${rideId}/user`, {
        method: "GET",
        credentials: "include",
        headers: {
            Cookie: cookie,
        },
    });
    if (!response.ok) {
        console.error(response.status, response.statusText);
        return;
    }
    const data = await response.json();

    return data;
}

async function requestForRide(Id, cookie) {
    const response = await fetch(`${API_KEY}/${RIDE}/${Id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: cookie },
        body: JSON.stringify({ status: "request_ride" }),
        credentials: "include",
    });
    if (!response.ok) {
        console.error(
            "failed to request for ride",
            response.status,
            response.statusText
        );
        return;
    }
    const { message } = await response.json();
    return message;
}

async function updateRide({ rideId, source, destination }, cookie) {
    const response = await fetch(`${API_KEY}/${RIDE}/${rideId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookie,
        },
        body: JSON.stringify({ source, destination }),
        credentials: "include",
    });
    if (!response.ok) {
        console.error(
            "failed to updateRide",
            response.status,
            response.statusText
        );
        return;
    }
    const { message } = await response.json();
    return message;
}

async function cancelRide(rideId, cookie) {
    const response = await fetch(`${API_KEY}/${RIDE}/${rideId}/cancel`, {
        method: "PATCH",
        headers: {
            Cookie: cookie,
        },
    });
    if (!response.ok) {
        console.error(
            "failed to cancel ",
            response.status,
            response.statusText
        );
        return;
    }
    const { message } = await response.json();
    return message;
}

async function setReview(rideDetails, cookies) {
    const response = await fetch(
        `${API_KEY}/${RIDE}/${rideDetails.Id}/review`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Cookies: cookies },
            body: JSON.stringify(rideDetails),
            credentials: "include",
        }
    );
    if (!response.ok) {
        console.error("failed to review", response.status, response.statusText);
        return;
    }
    const { message } = await response.json();
    return message;
}

export const ride = {
    setLocation,
    getRideDetails,
    updateRide,
    cancelRide,
    getRideAndDriver,
    getRideAndUser,
    requestForRide,
    setReview,
};
