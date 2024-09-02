import { Driver } from "../dtos/driver.dtos";
import { Review } from "../dtos/rating.dtos";
import { coordinates, LocationData, Ride } from "../dtos/ride.dto";
import { User } from "../dtos/user.dto";
// import fetch, { Response } from "node-fetch";

import {
    addDriver,
    addPin,
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

// type PriceMap = { [key: number]: number };

// const priceMap: PriceMap = {
//     5: 30,
//     10: 120,
//     15: 210,
//     20: 300,
//     25: 400,
//     30: 470,
//     50: 600,
//     100: 1000,
//     250: 3000,
// };

// function findPrice(distance:number){
//    if(!distance) return null;
//    for(let price in priceMap){
//     if(distance <= price){

//     }
//    }
// }

type PriceMap = Map<number, number>;

const priceMap: PriceMap = new Map([
    [5, 30],
    [10, 120],
    [15, 210],
    [20, 300],
    [25, 400],
    [30, 470],
    [50, 600],
    [100, 1000],
    [250, 3000],
    [300, 4000],
    [500, 6000],
]);

function findPrice(distance: number) {
    if (!distance) return null;

    for (let [dist, price] of priceMap) {
        if (distance <= dist) return price;
    }
    return 10000;
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

// async function getRoute(source, destination) {
//     console.log(source);
//     console.log(destination);

//     if (!isValidCoordinates(source) || !isValidCoordinates(destination)) {
//         console.log("coordinates are not valid");
//     }

//     try {
//         const response = await fetchWithTimeout(
//             `https://router.project-osrm.org/route/v1/driving/${source.y},${source.x};${destination.y},${destination.x}?overview=full&geometries=geojson`
//         );

//         if (!response.ok) return null;

//         const data = await response.json();

//         const routes = (data as OSRMResponse)?.routes ?? [];
//         return routes.length > 0 ? routes[0] : null;
//     } catch (error) {
//         console.error("Fetch error: eroor fetching route due to __", error);
//         return null;
//     }
// }

// const distanceCache = {};

const precesion = (input) => parseFloat(input.toFixed(5));

const toSixFloat = (obj) => {
    return {
        x: precesion(obj.x),
        y: precesion(obj.y),
    };
};

async function getDistance(source, destination) {
    const distance = await calculateDistance(source, destination);
    console.log("distance is : ");
    console.log(distance);
    if (distance === null) return null;
    if (distance === 0) return 0;
    return distance / 1000;
}

async function calculateDistance(source, destination) {
    // const source = toSixFloat(sourceObj);

    // const destination = toSixFloat(destinationObj);

    // const cacheKey = `${source.x},${source.y}-${destination.x},${destination.y}`;

    // if (distanceCache[cacheKey]) {
    //     return distanceCache[cacheKey];
    // }

    try {
        const response = await fetch(
            `https://api.geoapify.com/v1/routing?waypoints=${source.x},${source.y}|${destination.x},${destination.y}&mode=drive&apiKey=55b3a098f2a1408d8d10675b02843f50`
        );

        const data = await response.json();
        return data.features[0].properties.distance;
    } catch (err) {
        console.log(err);
        return null;
    }

    // return distanceCache[cacheKey];
}

//@return distance in kms
// async function getDistance(source: coordinates, destination: coordinates) {
//     if (!source || !destination) return null;

//     const route = await getRoute(source, destination);

//     if (!route) return null;

//     return route && route.distance / 1000;
// }

async function findDistance(
    source: number,
    destination: number
): Promise<number> {
    return 0;
}

function generatePin(): number {
    return Math.floor(1000 + Math.random() * 9000);
}

async function setPin(rideId: string, pin: number) {
    try {
        await addPin(rideId, pin);
    } catch (e) {
        console.error("error setting pin");
    }
}

export const rideServices = {
    create,
    read,
    update,
    setDriver,
    findPrice,
    getRideAndUser,
    getRideAndDriver,
    addReview,
    updateStatus,
    getStatus,
    getDistance,
    renameCoordinates,
    generatePin,
    setPin,
};
