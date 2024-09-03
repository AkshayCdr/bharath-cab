import { Location, Ride } from "../dtos/ride.dto";
import { User } from "../dtos/user.dto";
import {
    getDriverId,
    getLocation,
    getPin,
    getUserId,
    isPinExist,
} from "../model/ride.model";
import { driver } from "../services/driver.services";
import { rideServices } from "../services/ride.services";
import { DriverSocket } from "../types/driverSocket";
import { clientSock } from "./client.socket";
import { RideStatus } from "../dtos/ride.dto";
const driverSocket: DriverSocket = {};

function registerDriverSocket(socket: {
    on: (arg0: string, arg1: (driverID: string) => void) => void;
}) {
    socket.on("registerDriver", (driverID) => {
        console.log("driver reg with id:", driverID);
        registerDriver(driverID, socket);
    });
}

function registerDriver(driverId, socket) {
    driverSocket[driverId] = socket;
}

function setOffline(socket: {
    on: (arg0: string, arg1: (driverID: string) => void) => void;
}) {
    socket.on("setOffline", (driverID) => {
        console.log(`driver id ${driverID} went offline`);
        delete driverSocket[driverID];
    });
}

async function rideAccepted(socket: {
    on: (arg0: string, arg1: (rideData: any) => Promise<void>) => void;
}) {
    socket.on("driverAccept", async (rideData) => {
        console.log("inside ride accepted");
        const { driverId, rideId, userId } = rideData;

        const { status } = await rideServices.getStatus(rideId);

        const isCancelled = status === "cancelled";
        if (isCancelled) return;

        console.log("ride is not cancelled");

        await rideServices.setDriver(rideId, driverId);
        await rideServices.updateStatus(rideId, "driver_accepted");

        //set pin
        const pin = rideServices.generatePin();
        await rideServices.setPin(rideId, pin);

        console.log("driver set and status updated");
        const driverDetails = await driver.get(driverId);

        const driverDetailsAndPin = { ...driverDetails, pin };

        console.log("got driver details ");
        clientSock.rideAccepted(userId, driverDetailsAndPin);
        lockRide(socket, driverId);
    });
}

function lockRide(
    socket: {
        on: (arg0: string, arg1: (rideData: any) => Promise<void>) => void;
    },
    driverId: string
) {
    emitEventToAllDriver("lockRide", driverId);
}

const locationCache = new Map<string, Location>();

async function getCachedLocation(rideId: string): Promise<Location> {
    if (locationCache.has(rideId)) {
        console.log("getting cached source and destination");

        return locationCache.get(rideId);
    }

    const location = await getLocation(rideId);

    locationCache.set(rideId, location);

    return location;
}

async function updateLocation(socket: {
    on: (arg0: string, arg1: (data: any) => Promise<void>) => void;
}) {
    socket.on("updateLocation", async (data) => {
        const { rideId, latitude, longitude } = data;
        const { user_id } = await rideServices.read(rideId);

        await clientSock.sendLocation(user_id, latitude, longitude);

        let { source, destination } = await getCachedLocation(rideId);

        const rideLocation = rideServices.renameCoordinates({
            longitude,
            latitude,
        });

        const { status } = await rideServices.getStatus(rideId);

        console.log(status);

        if (status === RideStatus.Accepted) {
            const rideDistanceFromSource = await rideServices.getDistance(
                rideLocation,
                source
            );

            console.log("inside rideNEartby ");
            console.log(rideDistanceFromSource);

            eventRideNearby(rideDistanceFromSource, user_id, rideId);
        }

        if (status === RideStatus.Started || status === RideStatus.Accepted) {
            const rideDistanceFromSource = await rideServices.getDistance(
                rideLocation,
                source
            );

            console.log("inside ride start");
            console.log(rideDistanceFromSource);

            eventRideStart(rideDistanceFromSource, user_id, rideId);
        }

        if (status === RideStatus.OnRide) {
            const rideDistanceFromDestination = await rideServices.getDistance(
                rideLocation,
                destination
            );

            console.log("inside onride ");
            console.log(rideDistanceFromDestination);

            eventRideEnd(rideDistanceFromDestination, user_id, rideId);
        }
    });
}

async function eventRideNearby(
    rideDistanceFromSource: number,
    user_id: string,
    rideId: string
) {
    const isRideNearby =
        rideDistanceFromSource &&
        rideDistanceFromSource < 1 &&
        rideDistanceFromSource > 0.1;
    if (!isRideNearby) return;

    await rideNearby(user_id, rideId);
}

async function eventRideStart(
    rideDistanceFromSource: number,
    user_id: string,
    rideId: string
) {
    const isRideStarted =
        (rideDistanceFromSource || rideDistanceFromSource === 0) &&
        rideDistanceFromSource <= 0.1 &&
        rideDistanceFromSource >= 0;
    console.log(isRideStarted);
    if (!isRideStarted) return;
    await startRide(user_id, rideId);
}

async function eventRideEnd(
    rideDistanceFromDestination: number,
    user_id: string,
    rideId: string
) {
    const isRideEnded =
        (rideDistanceFromDestination || rideDistanceFromDestination === 0) &&
        rideDistanceFromDestination <= 0.1 &&
        rideDistanceFromDestination >= 0;
    console.log(isRideEnded);
    if (!isRideEnded) return;

    await endRide(user_id, rideId);
}

async function rideNearby(userId: string, rideId: string) {
    await rideServices.updateStatus(rideId, "started");
    clientSock.rideNearby(userId, rideId);

    const { driverId } = await getDriverId(rideId);

    emitEventToDriver("rideNearby", driverId, "");
}

async function startRide(userId: string, rideId: string) {
    const { driverId } = await getDriverId(rideId);
    console.log("sending start ride ");
    emitEventToDriver("startRide", driverId, "");
}

async function endRide(userId: string, rideId: string) {
    const { driverId } = await getDriverId(rideId);
    console.log("sending end ride ");
    emitEventToDriver("endRide", driverId, "");
}

async function requestForRide(rideDetails: Ride & User) {
    await rideServices.updateStatus(rideDetails.id, "requested");
    emitEventToAllDriver("rideRequest", rideDetails);
}

async function cancelRide(rideId: string) {
    const { driverId } = await getDriverId(rideId);

    if (!driverId) return emitEventToAllDriver("cancelRide", rideId);

    emitEventToDriver("cancelRide", driverId, "");
}

async function cancelRideDriver(socket) {
    socket.on("cancelRideDriver", async (rideId) => {
        await rideServices.updateStatus(rideId, "cancelled");
        await clientSock.cancel(rideId);
    });
}

async function rideStartDriver(socket) {
    socket.on("rideStartDriver", async (rideId) => {
        const { user_id } = await rideServices.read(rideId);
        await rideServices.updateStatus(rideId, "onride");
        clientSock.startRide(user_id, rideId);
    });
}

async function rideEndDriver(socket) {
    socket.on("rideEndDriver", async (rideId) => {
        const { user_id } = await rideServices.read(rideId);
        await rideServices.updateStatus(user_id, "ride_ended");
        clientSock.endRide(user_id, rideId);
    });
}

function emitEventToAllDriver(eventName: string, data: any) {
    for (let driverId in driverSocket) {
        emitEventToDriver(eventName, driverId, data);
    }
}

function emitEventToDriver(eventName: string, driverId: string, data: any) {
    if (driverSocket[driverId]) {
        driverSocket[driverId].emit(eventName, data);
    }
}

function isDriverExist(socket: any) {
    return Object.values(driverSocket).includes(socket);
}

function deleteClient(socket: any) {
    for (let driverId in driverSocket) {
        if (driverSocket[driverId] === socket) {
            console.log(`driver with ${driverId} disconnected`);
            delete driverSocket[driverId];
            break;
        }
    }
}

async function otpValidate(socket: {
    on: (
        arg0: string,
        arg1: ({ otp, rideId }: { otp: any; rideId: any }) => Promise<void>
    ) => void;
}) {
    socket.on("otpValidate", async ({ otp, rideId }) => {
        console.log("inside otp validate");
        const { pin } = await getPin(rideId);

        console.log(otp);
        console.log(pin);
        console.log(typeof otp);
        console.log(typeof pin);

        const isPinValid = pin === parseInt(otp);
        console.log("is pin validated");
        console.log(isPinValid);

        const { driverId } = await getDriverId(rideId);
        console.log("sending to driver id");

        if (!isPinValid)
            return emitEventToDriver("otpValFailure", driverId, "");

        emitEventToDriver("otpValSuccess", driverId, "");
    });
}

export const driverSock = {
    registerDriverSocket,
    registerDriver,
    setOffline,
    rideAccepted,
    updateLocation,
    requestForRide,
    cancelRide,
    isDriverExist,
    deleteClient,
    rideStartDriver,
    rideEndDriver,
    otpValidate,
    cancelRideDriver,
};
