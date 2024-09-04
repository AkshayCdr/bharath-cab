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
import { getAccountType, isAccoutIdExist } from "../model/account.model";

async function authenticate(socket, next) {
    console.log(socket.handshake.auth);
    if (!socket.handshake.auth) return next(new Error("No auth"));
    const { token } = socket.handshake.auth;

    if (!token) {
        console.log("no token aval");
        return next(new Error("No token"));
    }

    const isAuthenticated = token && (await isAccoutIdExist(token));

    if (!isAuthenticated) {
        console.log("not authenticated");
        return next(new Error("Invalid token"));
    }

    if (token) registerSocket(socket, token);
    next();
}

export function createSocket(
    httpServer: HTTPServer.Server<
        typeof HTTPServer.IncomingMessage,
        typeof HTTPServer.ServerResponse
    >
): Server {
    const io = new Server(httpServer, {
        cors: {
            origin: [
                "https://bharat-cab-client.onrender.com",
                "http://localhost:5173",
                "http://localhost:5000",
            ],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use(async (socket, next) => {
        // const cookiesHeader = socket.handshake.headers.cookie;

        await authenticate(socket, next);
        // console.log(socket.handshake.headers);
        // console.log(cookiesHeader);
        // if (!cookiesHeader) {
        //     console.log("no cookies found returningn.....");
        //     return next(new Error("No cookies found"));
        // }

        // const cookies = parse(cookiesHeader);
        // const sessionId = cookies.sessionId;

        // const isAuthenticated = sessionId && (await isSessionExist(sessionId));

        // if (!isAuthenticated) {
        //     console.log("not authenticated returnning ....");
        //     return next(new Error("Invalid"));
        // }

        // console.log(sessionId);
        // registerSocket(socket, sessionId);
        next();
    });

    io.on("connect", async (socket) => {
        console.log("connected");

        if (socket.recovered) {
            console.log("restored the socket ids");
        } else {
            console.log("could not recover");
            console.log(socket.handshake.auth);
            const { token } = socket.handshake.auth;
            if (!token) {
                socket.disconnect();
                return;
            }
            await registerSocket(socket, token);
        }

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

async function registerSocket(socket, accountId) {
    const accountType = await getAccountType(accountId);
    console.log(accountType);

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
