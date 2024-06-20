import { DriverSocket } from "../types/driverSocket";

export const driverSocket: DriverSocket = {};

async function registerDriverSocket(socket: {
  on: (arg0: string, arg1: (driverID: string) => void) => void;
}) {
  socket.on("registerDriver", (driverID: string) => {
    console.log("driver reg with id:", driverID);
    driverSocket[driverID] = socket;
  });
}

export const driverSock = {
  registerDriverSocket,
};
