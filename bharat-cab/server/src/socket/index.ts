import { Server, Socket } from "socket.io";
import { driverSock } from "./driver.socket";
import { clientSock } from "./client.socket";
import HTTPServer from "http";

import { parse } from "cookie";
import {
    getAccountIdTable,
    getAccountTypeTable,
    isSessionExist,
} from "../model/session.model";
import { driver } from "../services/driver.services";
import { account } from "../services/account.services";
import cookieParser from "cookie-parser";

export function createSocket(
    httpServer: HTTPServer.Server<
        typeof HTTPServer.IncomingMessage,
        typeof HTTPServer.ServerResponse
    >
): Server {
    const io = new Server(httpServer, {
        cookie: true,
        cors: {
            origin: "https://bharat-cab-client.onrender.com",
            // origin: "http://localhost:3000",
            // origin: "http://localhost:5000",
            credentials: true,
        },
    });

    io.use(async (socket, next) => {
        const cookiesHeader = socket.handshake.headers.cookie;
        console.log(cookiesHeader);
        if (!cookiesHeader) {
            console.log("no cookies found returningn.....");
            return next(new Error("No cookies found"));
        }

        const cookies = parse(cookiesHeader);
        const sessionId = cookies.sessionId;

        const isAuthenticated = sessionId && (await isSessionExist(sessionId));

        if (!isAuthenticated) {
            console.log("not authenticated returnning ....");
            return next(new Error("Invalid"));
        }

        console.log(sessionId);
        registerSocket(socket, sessionId);
        next();
    });

    io.on("connect", (socket) => {
        console.log("connected");

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

async function registerSocket(socket, sessionId) {
    const accountType = await getAccountTypeTable(sessionId);
    console.log(accountType);
    const accountId = await getAccountIdTable(sessionId);
    console.log(accountId);
    if (accountType === "driver") {
        console.log("registering driver");
        driverSock.registerDriver(accountId, socket);
    }
    if (accountType === "user") {
        console.log("registering client");
        clientSock.registerClient(accountId, socket);
    }
}

function handleDisconnection(socket: any) {
    socket.on("disconnect", () => {
        console.log("disconnected");
        const isRegistered =
            driverSock.isDriverExist(socket) ||
            clientSock.isClientExist(socket);

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
