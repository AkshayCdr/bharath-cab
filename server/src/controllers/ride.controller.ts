import { Request, Response } from "express";
import { Ride } from "../dtos/ride.dto";
import { rideServices } from "../services/ride.services";
import { Id } from "../types/id";

export async function insertIntoRide(
  req: Request<{}, {}, Ride>,
  res: Response
): Promise<void> {
  try {
    //source and destination

    const { source, destination } = req.body;

    console.log(source);
    console.log(destination);

    console.log(typeof source);
    console.log(typeof destination);

    //get distance
    const distance = rideServices.findDistance(source, destination);
    //calculate price
    const price = rideServices.findPrice(distance);

    const newRide = {
      source,
      destination,
      price,
    };
    //add data in database
    const id = await rideServices.create(newRide);

    res.status(200).send({ id });
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
