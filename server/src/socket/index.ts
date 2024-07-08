import { Server, Socket } from "socket.io";
import { driverSock, driverSocket } from "./driver.socket";
import { clientSock, clientSocket } from "./client.socket";
import HTTPServer from "http";
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

    driverSock.rideNearby(socket);
    driverSock.startRide(socket);
    driverSock.endRide(socket);

    handleDisconnection(socket);
  });

  return io;
}

function handleDisconnection(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  socket.on("disconnect", () => {
    if (
      !(
        Object.values(driverSocket).includes(socket) ||
        Object.values(clientSocket).includes(socket)
      )
    ) {
      console.log("disconnected");
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
        if (driverSocket[driverId] === socket) {
          console.log(`driver with ${driverId} disconnected`);
          delete driverSocket[driverId];
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
