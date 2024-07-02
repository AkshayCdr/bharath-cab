import { ClientSocket } from "../types/clientSocket";

export const clientSocket: ClientSocket = {};

async function registerClientSocket(socket: {
  on: (arg0: string, arg1: (clientID: string) => void) => void;
}) {
  socket.on("registerClient", (clientID: string) => {
    console.log("client reg with id:", clientID);
    clientSocket[clientID] = socket;
  });
}

async function rideAccepted(userId: string, driverDetails: any) {
  if (clientSocket[userId]) {
    clientSocket[userId].emit("rideAccepted", driverDetails);
  }
}

export const clientSock = {
  registerClientSocket,
  rideAccepted,
};
