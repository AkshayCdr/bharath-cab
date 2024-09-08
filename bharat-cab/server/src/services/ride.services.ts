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

function getDistanceFromLatLonInKm(source, destination) {
    const radiusOfEarthKm = 6371;
    const dLat = deg2rad(destination.x - source.x); // deg2rad below
    const dLon = deg2rad(destination.y - source.y);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(source.x)) *
            Math.cos(deg2rad(destination.x)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = radiusOfEarthKm * c;
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

async function getDistance(source, destination) {
    const distance = getDistanceFromLatLonInKm(source, destination);
    return distance;
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
