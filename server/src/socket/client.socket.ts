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

export const clientSock = {
  registerClientSocket,
};
