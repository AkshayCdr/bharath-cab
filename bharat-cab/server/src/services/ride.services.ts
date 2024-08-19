import { Driver } from "../dtos/driver.dtos";
import { Review } from "../dtos/rating.dtos";
import { coordinates, LocationData, Ride } from "../dtos/ride.dto";
import { User } from "../dtos/user.dto";
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
async function getRoute(source, destination) {
    console.log(source);
    console.log(destination);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

    try {
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${source.y},${source.x};${destination.y},${destination.x}?overview=full&geometries=geojson`,
            { signal: controller.signal }
        );

        clearTimeout(timeout);

        if (!response.ok) return null;

        const data = await response.json();

        return data.routes.length > 0 ? data.routes[0] : null;
    } catch (error) {
        console.error("Fetch error:", error);
        return null;
    }
}

async function getDistance(source: coordinates, destination: coordinates) {
    const route = await getRoute(source, destination);

    // if (!route) return null;

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
