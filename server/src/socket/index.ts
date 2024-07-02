import { Server } from "socket.io";
import { driverSock, driverSocket } from "./driver.socket";
import { clientSock, clientSocket } from "./client.socket";
import HTTPServer from "http";
import { driver } from "../services/driver.services";
import { Ride } from "../dtos/ride.dto";

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

    driverSock.registerDriverSocket(socket);
    driverSock.setOffline(socket);

    clientSock.registerClientSocket(socket);

    driverSock.rideAccepted(socket);

    // get ride details and send just use ride details for this
    socket.on("updateLocation", (data) => {
      const { rideId, latitude, longitude } = data;
      console.log("inside server" + latitude);
      console.log("inside server" + longitude);
      for (let client in clientSocket) {
        clientSocket[client].emit("updateLocation", [latitude, longitude]);
      }
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
