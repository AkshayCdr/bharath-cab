import { Server, Socket } from "socket.io";
import { driverSock, driverSocket as sockets } from "./driver.socket";
import { clientSock, clientSocket } from "./client.socket";
import HTTPServer from "http";
import { driver } from "../services/driver.services";
import { Ride } from "../dtos/ride.dto";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

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

    driverSock.updateLocation(socket);

    handleDisconnection(socket);
  });

  return io;
}

function handleDisconnection(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  socket.on("disconnect", () => {
    console.log("disconnected");
    if (
      !(
        Object.values(sockets).includes(socket) ||
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

    if (Object.values(sockets).includes(socket)) {
      for (let driverId in sockets) {
        if (sockets[driverId] === socket) {
          console.log(`driver with ${driverId} disconnected`);
          delete sockets[driverId];
          break;
        }
      }
    }
  });
}

// function removeSocket(sockets, socket, role) {
//   if (Object.values(sockets).includes(socket)) {
//     for (let id in sockets) {
//       if (sockets[id] === socket) {
//         console.log(`${role} with ${id} disconnected`);
//         delete sockets[id];
//         break;
//       }
//     }
//   }
// }
