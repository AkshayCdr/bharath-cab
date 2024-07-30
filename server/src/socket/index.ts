import { Server, Socket } from "socket.io";
import { driverSock } from "./driver.socket";
import { clientSock } from "./client.socket";
import HTTPServer from "http";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { parse } from "cookie";

export function createSocket(
  httpServer: HTTPServer.Server<
    typeof HTTPServer.IncomingMessage,
    typeof HTTPServer.ServerResponse
  >
) {
  const io = new Server(httpServer, {
    cookie: true,
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // io.use((socket, next) => {
  //   // Middleware to log cookies
  //   console.log(`Cookies: ${socket.handshake.headers.cookie}`);
  //   next();
  // });

  io.on("connect", (socket) => {
    const cookies = parse(socket.handshake.headers.cookie || "");
    console.log(cookies);
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

    clientSock.cancelRide(socket);

    handleDisconnection(socket);
  });

  return io;
}

function handleDisconnection(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  socket.on("disconnect", () => {
    const isRegistered =
      driverSock.isDriverExist(socket) || clientSock.isClientExist(socket);

    if (!isRegistered) {
      console.log("disconnected");
      return;
    }

    if (clientSock.isClientExist(socket)) {
      clientSock.deleteClient(socket);
      return;
    }

    if (driverSock.isDriverExist(socket)) {
      driverSock.deleteClient(socket);
      return;
    }
  });
}
