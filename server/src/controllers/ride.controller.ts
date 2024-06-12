import { Request, Response } from "express";
import { Ride } from "../dtos/ride.dto";
import { rideServices } from "../services/ride.services";

export async function insertIntoRide(
  req: Request<{}, {}, Ride>,
  res: Response
): Promise<void> {
  try {
    //source and destination
    const { source, destination } = req.body;

    //get distance
    const distance = rideServices.findDistance(source, destination);
    //calculate price
    const price = rideServices.findPrice(distance);
    //add data in database
    const id = await rideServices.create({
      source,
      destination,
      price,
    });

    res.status(200).send({ id });
    //response will be new ride id
  } catch (error) {
    res.status(500).send({ message: "id not generated" });
  }
}
