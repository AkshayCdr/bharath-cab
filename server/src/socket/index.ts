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

    socket.on("driverAccept", async (rideData) => {
      console.log("driver accepted", rideData.userId, rideData.driverId);
      const { userId, driverId }: Ride = rideData;
      //send to userid
      //send the driver details to user
      //set driver to ride
      const driverDetails = await driver.get(driverId);
      console.log(driverDetails);

      if (clientSocket[userId]) {
        clientSocket[userId].emit("rideAccepted", driverDetails);
      }

      //send to other drivers
      for (let socket in driverSocket) {
        driverSocket[socket].emit("lockRide", driverId);
      }
      //remove client data from other driver
    });

    // get ride details and send just use ride details for this
    socket.on("updateLocation", (data) => {
      const { driverData, latitude, longitude } = data;
      console.log(latitude);
      console.log(longitude);
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
