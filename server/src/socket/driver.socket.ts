import { Ride } from "../dtos/ride.dto";
import { driver } from "../services/driver.services";
import { rideServices } from "../services/ride.services";
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
    const driverDetails = await driver.get(driverId);
    clientSock.rideAccepted(userId, driverDetails);
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

async function updateLocation(socket: {
  on: (
    arg0: string,
    arg1: (data: { rideId: any; latitude: any; longitude: any }) => void
  ) => void;
}) {
  socket.on(
    "updateLocation",
    async (data: { rideId: string; latitude: number; longitude: number }) => {
      const { rideId, latitude, longitude } = data;
      const { user_id } = await rideServices.read(rideId);
      clientSock.sendLocation(user_id, latitude, longitude);
    }
  );
}

// async function endRide(socket){
//   socket.on('endRide',async(rideDetails) =>{
//     console.log(rideDetails)
//     //get userid and send to client
//     // const { user_id } = await rideServices.read(rideId);
//     // clientSock.endRide(user_id,rideId)

//   })
// }

async function rideNearby(socket: {
  on: (arg0: string, arg1: (rideDetails: any) => void) => void;
}) {
  socket.on("rideNearby", (rideDetails) => {
    console.log(rideDetails);
  });
}

export const driverSock = {
  registerDriverSocket,
  setOffline,
  rideAccepted,
  updateLocation,
  rideNearby,
  // endRide
};
