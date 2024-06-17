import { Request, Response } from "express";
import { Ride } from "../dtos/ride.dto";
import { rideServices } from "../services/ride.services";
import { Id } from "../types/id";
import { user } from "../services/user.services";

export async function insertIntoRide(
  req: Request<{}, {}, Ride>,
  res: Response
): Promise<void> {
  try {
    //source and destination

    const { userId, source, destination } = req.body;

    console.log(userId);
    console.log(source);
    console.log(destination);

    console.log(typeof userId);
    console.log(typeof source);
    console.log(typeof destination);

    //get distance
    const distance = rideServices.findDistance(source, destination);
    //calculate price
    const price = rideServices.findPrice(distance);

    const newRide = {
      userId,
      source,
      destination,
      price,
    };
    console.log("here");
    //add data in database
    const rideId = await rideServices.create(newRide);

    console.log("here");
    console.log("id inside controller is ", rideId);
    res.status(201).send({ rideId });
    //response will be new ride id
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
