import { Ride } from "../dtos/ride.dto";
import { ClientSocket } from "../types/clientSocket";
import { driverSock } from "./driver.socket";

export const clientSocket: ClientSocket = {};

async function registerClientSocket(socket: {
  on: (arg0: string, arg1: (clientID: string) => void) => void;
}) {
  socket.on("registerClient", (clientID: string) => {
    console.log("client reg with id:", clientID);
    clientSocket[clientID] = socket;
  });
}

async function rideAccepted(clientId: string, driverDetails: any) {
  emitEventToClient("rideAccepted", clientId, driverDetails);
}

async function sendLocation(
  clientId: string,
  latitude: number,
  longitude: number
) {
  emitEventToClient("updateLocation", clientId, [latitude, longitude]);
}

async function endRide(clientId: string, rideId: string) {
  emitEventToClient("endRide", clientId, rideId);
}

async function startRide(clientId: string, rideId: string) {
  emitEventToClient("startRide", clientId, rideId);
}

async function rideNearby(clientId: string, rideId: string) {
  emitEventToClient("rideNearby", clientId, rideId);
}

async function emitEventToClient(
  eventName: string,
  clientId: string,
  data: any
) {
  if (clientSocket[clientId]) {
    clientSocket[clientId].emit(eventName, data);
  }
}

async function cancelRide(socket: {
  on: (arg0: string, arg1: (rideId: string) => void) => void;
}) {
  //send ride cancel to driver
  //set ride to cancelled in database
  //set
  socket.on("cancelRide", (rideId: string) => {
    // const {driverId} =
    driverSock.cancelRide("cancelRide", rideId);
  });
}

export const clientSock = {
  registerClientSocket,
  rideAccepted,
  sendLocation,
  rideNearby,
  endRide,
  startRide,
  cancelRide,
};
