import { Request, Response } from "express";
import { Ride } from "../dtos/ride.dto";
import { rideServices } from "../services/ride.services";
import { Id } from "../types/id";
import { user } from "../services/user.services";
import { driverSocket } from "../socket/driver.socket";

export async function insertIntoRide(
  req: Request<{}, {}, Ride>,
  res: Response
): Promise<void> {
  try {
    const { userId, source, destination } = req.body;

    const distance = rideServices.findDistance(source, destination);

    const price = rideServices.findPrice(distance);

    const newRide = {
      userId,
      source,
      destination,
      price,
    };

    const rideId = await rideServices.create(newRide);

    res.status(201).send({ rideId });
  } catch (error) {
    res.status(500).send({ message: "id not generated", error });
  }
}

export async function getRide(req: Request<Id>, res: Response) {
  try {
    const { id } = req.params;
    const rideDetails = await rideServices.read(id);
    res.status(200).send(JSON.stringify(rideDetails));
  } catch (error) {
    res.status(500).send({ message: "cannot reterive data", error });
  }
}

export async function rideDetails(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(500).send({ message: "Error setting ride " });
  }
}

export async function requestForRide(
  req: Request<Id, {}, Ride>,
  res: Response
) {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const rideDetails = await rideServices.getRideAndUser(id);
    console.log("ride Details user ride", rideDetails);

    console.log(Object.keys(driverSocket));
    for (let driverId in driverSocket) {
      driverSocket[driverId].emit("rideRequest", rideDetails);
    }

    res.status(200).send({ message: "waiting for the driver" });
  } catch (error) {
    res.status(500).send({ message: "error requesting ride", error });
  }
}
