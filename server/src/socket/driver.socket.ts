import { Ride } from "../dtos/ride.dto";
import { driver } from "../services/driver.services";
import { DriverSocket } from "../types/driverSocket";
import { clientSock } from "./client.socket";

export const driverSocket: DriverSocket = {};

async function registerDriverSocket(socket: {
  on: (arg0: string, arg1: (driverID: string) => void) => void;
}) {
  socket.on("registerDriver", (driverID: string) => {
    console.log("driver reg with id:", driverID);
    driverSocket[driverID] = socket;
  });
}

async function setOffline(socket: {
  on: (arg0: string, arg1: (driverID: string) => void) => void;
}) {
  socket.on("setOffline", (driverID: string) => {
    console.log(`driver id ${driverID} went offline`);
    delete driverSocket[driverID];
  });
}

async function rideAccepted(socket: {
  on: (arg0: string, arg1: (rideData: any) => Promise<void>) => void;
}) {
  socket.on("driverAccept", async (rideData) => {
    console.log("driver accepted", rideData.userId, rideData.driverId);
    const { userId, driverId }: Ride = rideData;
    //send to userid
    //send the driver details to user
    //set driver to ride
    const driverDetails = await driver.get(driverId);
    console.log(driverDetails);

    clientSock.rideAccepted(userId, driverDetails);

    //send to other drivers
    lockRide(socket, driverId);
  });
}

async function lockRide(
  socket: {
    on: (arg0: string, arg1: (rideData: any) => Promise<void>) => void;
  },
  driverId: string
) {
  for (let socket in driverSocket) {
    driverSocket[socket].emit("lockRide", driverId);
  }
}

export const driverSock = {
  registerDriverSocket,
  setOffline,
  rideAccepted,
};
