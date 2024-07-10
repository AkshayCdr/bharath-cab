import { Ride } from "../dtos/ride.dto";
import { User } from "../dtos/user.dto";
import { driver } from "../services/driver.services";
import { rideServices } from "../services/ride.services";
import { DriverSocket } from "../types/driverSocket";
import { clientSock } from "./client.socket";

export const driverSocket: DriverSocket = {};

function registerDriverSocket(socket: {
  on: (arg0: string, arg1: (driverID: string) => void) => void;
}) {
  socket.on("registerDriver", (driverID) => {
    console.log("driver reg with id:", driverID);
    driverSocket[driverID] = socket;
  });
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
    console.log("driver accepted");
    console.log(rideData);
    const { driverId, id: rideId, userId }: Ride = rideData;
    await rideServices.update(rideId, driverId);
    const driverDetails = await driver.get(driverId);
    clientSock.rideAccepted(userId, driverDetails);
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

async function updateLocation(socket: {
  on: (
    arg0: string,
    arg1: (data: {
      rideId: string;
      latitude: number;
      longitude: number;
    }) => void
  ) => void;
}) {
  socket.on("updateLocation", async (data) => {
    const { rideId, latitude, longitude } = data;
    const { user_id } = await rideServices.read(rideId);
    clientSock.sendLocation(user_id, latitude, longitude);
  });
}

function rideNearby(socket: {
  on: (arg0: string, arg1: (rideDetails: any) => void) => void;
}) {
  socket.on("rideNearby", (rideDetails) => {
    const { user_id, id } = rideDetails;
    clientSock.rideNearby(user_id, id);
  });
}

function startRide(socket: {
  on: (arg0: string, arg1: (rideDetails: any) => void) => void;
}) {
  socket.on("startRide", (rideDetails) => {
    const { user_id, id } = rideDetails;
    clientSock.startRide(user_id, id);
  });
}

function endRide(socket: {
  on: (arg0: string, arg1: (rideDetails: any) => void) => void;
}) {
  socket.on("endRide", (rideDetails) => {
    const { user_id, id } = rideDetails;
    clientSock.endRide(user_id, id);
  });
}

function requestForRide(rideDetails: Ride & User) {
  emitEventToAllDriver("rideRequest", rideDetails);
}

function cancelRide(eventName: string, rideId: string) {
  emitEventToAllDriver(eventName, rideId);
}

function emitEventToAllDriver(eventName: string, data: any) {
  if (Object.keys(driverSocket).length > 0) {
    for (let driverId in driverSocket) {
      emitEventToDriver(eventName, driverId, data);
    }
  }
}

function emitEventToDriver(eventName: string, driverId: string, data: any) {
  if (driverSocket[driverId]) {
    driverSocket[driverId].emit(eventName, data);
  }
}

export const driverSock = {
  registerDriverSocket,
  setOffline,
  rideAccepted,
  updateLocation,
  rideNearby,
  requestForRide,
  startRide,
  endRide,
  cancelRide,
};
