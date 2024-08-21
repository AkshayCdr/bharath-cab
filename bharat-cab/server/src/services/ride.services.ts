import { Driver } from "../dtos/driver.dtos";
import { Review } from "../dtos/rating.dtos";
import { coordinates, LocationData, Ride } from "../dtos/ride.dto";
import { User } from "../dtos/user.dto";
// import fetch, { Response } from "node-fetch";

import {
    addDriver,
    getFromRideTable,
    getRideAndDriverFromTable,
    getRideAndUserFromTable,
    getStatusFromRide,
    insertIntoRideTable,
    updateReview,
    updateRideStatus,
    updateRideTable,
} from "../model/ride.model";

async function create(ride: any): Promise<string> {
    return insertIntoRideTable(ride);
}

async function read(id: string): Promise<Ride> {
    return getFromRideTable(id);
}

async function update(ride: any): Promise<void> {
    return updateRideTable(ride);
}

async function getRideAndUser(id: string): Promise<Ride & User> {
    return getRideAndUserFromTable(id);
}

async function getRideAndDriver(id: string): Promise<Ride & Driver> {
    return getRideAndDriverFromTable(id);
}

async function setDriver(rideId: string, driverId: string): Promise<void> {
    return addDriver(rideId, driverId);
}

async function addReview(rideDetails: Review): Promise<void> {
    return updateReview(rideDetails);
}

async function updateStatus(id: string, status: string): Promise<void> {
    return updateRideStatus(id, status);
}

async function getStatus(id: string): Promise<{ status: string }> {
    return getStatusFromRide(id);
}

async function del(): Promise<void> {}

async function findPrice(source: number, destination: number): Promise<number> {
    const minFee = 10;
    const distance = await findDistance(source, destination);
    const distanceToPrice = {};
    return minFee + 0;
}

function renameCoordinates(obj: LocationData): coordinates {
    return {
        x: obj.latitude,
        y: obj.longitude,
    };
}

// async function getRoute(source: coordinates, destination: coordinates) {
//     console.log(source);
//     console.log(destination);
//     const response = await fetch(
//         `https://router.project-osrm.org/route/v1/driving/${source.y},${source.x};${destination.y},${destination.x}?overview=full&geometries=geojson`
//     );

//     if (!response.ok) return null;

//     const data = await response.json();

//     return data.routes.length > 0 ? data.routes[0] : null;
// }

// d

const fetchWithTimeout = (url, timeout = 5000): Promise<Response> => {
    return Promise.race([
        fetch(url),
        new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), timeout)
        ),
    ]);
};

interface Route {
    duration: number;
    distance: number;
    geometry: {
        type: string;
        coordinates: number[][];
    };
}

interface OSRMResponse {
    routes: Route[];
}

function isValidCoordinates(coords: coordinates) {
    if (typeof coords.x !== "number" || typeof coords.y !== "number") {
        console.log("invalid coordinates : type is not number");
        return false;
    }

    return coords.x >= -90 && coords.y >= -180 && coords.y <= 180;
}

async function getRoute(source, destination) {
    console.log(source);
    console.log(destination);

    // console.log(isValidCoordinates)

    if (!isValidCoordinates(source) || !isValidCoordinates(destination)) {
        console.log("coordinates are not valid");
    }

    try {
        // const response = await fetch(
        //     `https://router.project-osrm.org/route/v1/driving/${source.y},${source.x};${destination.y},${destination.x}?overview=full&geometries=geojson`
        // );

        const response = await fetchWithTimeout(
            `https://router.project-osrm.org/route/v1/driving/${source.y},${source.x};${destination.y},${destination.x}?overview=full&geometries=geojson`
        );

        if (!response.ok) return null;

        const data = await response.json();

        const routes = (data as OSRMResponse)?.routes ?? [];
        return routes.length > 0 ? routes[0] : null;
    } catch (error) {
        console.error("Fetch error: eroor fetching route due to __", error);
        return null;
    }
}

//@return distance in kms
async function getDistance(source: coordinates, destination: coordinates) {
    if (!source || !destination) return null;

    const route = await getRoute(source, destination);

    if (!route) return null;

    return route && route.distance / 1000;
}

async function findDistance(
    source: number,
    destination: number
): Promise<number> {
    return 0;
}

export const rideServices = {
    create,
    read,
    update,
    setDriver,
    del,
    findPrice,
    getRideAndUser,
    getRideAndDriver,
    addReview,
    updateStatus,
    getStatus,
    getDistance,
    renameCoordinates,
};
