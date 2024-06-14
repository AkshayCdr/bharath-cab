import { Server } from "socket.io";
import { driverSocket } from "./driver.socket";
import { clientSocket } from "./client.socket";
import HTTPServer from "http";

export function createSocket(
  httpServer: HTTPServer.Server<
    typeof HTTPServer.IncomingMessage,
    typeof HTTPServer.ServerResponse
  >
) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  io.on("connect", (socket) => {
    console.log("connected");
    console.log(socket.id);

    socket.on("registerDriver", (driverID: string) => {
      console.log(driverID);
      driverSocket[driverID] = socket;
    });

    socket.on("registerClient", (clientID: string) => {
      console.log(clientID);
      clientSocket[clientID] = socket;
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      if (
        !(
          Object.values(driverSocket).includes(socket) ||
          Object.values(clientSocket).includes(socket)
        )
      ) {
        return;
      }
      if (Object.values(clientSocket).includes(socket)) {
        for (let clientId in clientSocket) {
          if (clientSocket[clientId] === socket) {
            console.log(`client with ${clientId} disconnected`);
            delete clientSocket[clientId];
            break;
          }
        }
      }

      if (Object.values(driverSocket).includes(socket)) {
        for (let driverId in driverSocket) {
          if (clientSocket[driverId] === socket) {
            console.log(`driver with ${driverId} disconnected`);
            delete clientSocket[driverId];
            break;
          }
        }
      }
    });
  });

  return io;
}
