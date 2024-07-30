import { Ride } from "../dtos/ride.dto";
import { rideServices } from "../services/ride.services";
import { ClientSocket } from "../types/clientSocket";
import { driverSock } from "./driver.socket";

const clientSocket: ClientSocket = {};

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
  socket.on("cancelRide", (rideId: string) => {
    rideServices.updateStatus(rideId, "cancelled");
    driverSock.cancelRide(rideId);
  });
}

function isClientExist(socket: any) {
  return Object.values(clientSocket).includes(socket);
}

function deleteClient(socket: any) {
  for (let clientId in clientSocket) {
    if (clientSocket[clientId] === socket) {
      console.log(`client with ${clientId} disconnected`);
      delete clientSocket[clientId];
      break;
    }
  }
}

export const clientSock = {
  registerClientSocket,
  rideAccepted,
  sendLocation,
  rideNearby,
  endRide,
  startRide,
  cancelRide,
  isClientExist,
  deleteClient,
};
