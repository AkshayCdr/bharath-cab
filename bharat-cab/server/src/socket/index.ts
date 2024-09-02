import { Server, Socket } from "socket.io";
import { driverSock } from "./driver.socket";
import { clientSock } from "./client.socket";
import HTTPServer from "http";

import { parse } from "cookie";
import { isSessionExist } from "../model/session.model";
import { driver } from "../services/driver.services";

export function createSocket(
    httpServer: HTTPServer.Server<
        typeof HTTPServer.IncomingMessage,
        typeof HTTPServer.ServerResponse
    >
): Server {
    const io = new Server(httpServer, {
        cookie: false,
        cors: {
            origin: "*",
        },
    });

    // io.use(async (socket, next) => {
    //     const cookiesHeader = socket.handshake.headers.cookie;

    //     if (!cookiesHeader) return next(new Error("No cookies found"));

    //     const cookies = parse(cookiesHeader);
    //     const sessionId = cookies.sessionId;

    //     const isAuthenticated = sessionId && (await isSessionExist(sessionId));

    //     if (!isAuthenticated) return next(new Error("Invalid"));

    //     next();
    // });

    io.on("connect", (socket) => {
        console.log("connected");
        console.log(socket.id);

        driverSock.registerDriverSocket(socket);
        driverSock.setOffline(socket);

        clientSock.registerClientSocket(socket);

        driverSock.rideAccepted(socket);

        driverSock.updateLocation(socket);

        driverSock.otpValidate(socket);

        driverSock.rideStartDriver(socket);
        driverSock.rideEndDriver(socket);

        clientSock.cancelRide(socket);
        driverSock.cancelRideDriver(socket);

        handleDisconnection(socket);
    });

    return io;
}

function handleDisconnection(socket: any) {
    socket.on("disconnect", () => {
        console.log("disconnected");
        // const isRegistered =
        //   driverSock.isDriverExist(socket) || clientSock.isClientExist(socket);

        // if (!isRegistered) {
        //   console.log("disconnected");
        //   return;
        // }

        // if (clientSock.isClientExist(socket)) {
        //   clientSock.deleteClient(socket);
        //   return;
        // }

        // if (driverSock.isDriverExist(socket)) {
        //   driverSock.deleteClient(socket);
        //   return;
        // }
    });
}
