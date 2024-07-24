import { Request, Response } from "express";
import { Ride } from "../dtos/ride.dto";
import { rideServices } from "../services/ride.services";
import { Id } from "../types/id";
import { user } from "../services/user.services";
import { driverSock } from "../socket/driver.socket";

export async function insertIntoRide(
  req: Request<{}, {}, Ride>,
  res: Response
): Promise<void> {
  try {
    const { userId, source, destination } = req.body;

    const distance = 10;

    const price = 10;

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

export async function updateRide(req: Request<Id, {}, Ride>, res: Response) {
  try {
    const { id } = req.params;
    const { source, destination } = req.body;

    const price = 10;

    const updatedRide = {
      id,
      source,
      destination,
      price,
    };

    await rideServices.update(updatedRide);

    res.status(200).send({ message: "ride Updated" });
  } catch (error) {
    res.status(500).send({ message: "cannot udpate ride ", error });
  }
}

export async function cancelRide(req: Request<Id>, res: Response) {
  try {
    const { id } = req.params;

    await rideServices.updateStatus(id, "cancelled");

    driverSock.cancelRide(id);

    res.status(200).send({ message: "ride cancellled" });
  } catch (error) {
    res.status(500).send({ message: "cannot ride error ", error });
  }
}

export async function getRideAndDriver(req: Request<Id>, res: Response) {
  try {
    const { id } = req.params;
    const rideDetails = await rideServices.getRideAndDriver(id);
    console.log(rideDetails);
    res.status(200).send(JSON.stringify(rideDetails));
  } catch (error) {
    res.status(500).send({ message: "cannot reterive data", error });
  }
}

export async function getRideAndUser(req: Request<Id>, res: Response) {
  try {
    console.log("inside ride and user");
    const { id } = req.params;
    const rideDetails = await rideServices.getRideAndUser(id);
    console.log(rideDetails);
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

    await driverSock.requestForRide(rideDetails);

    res.status(200).send({ message: "waiting for the driver" });
  } catch (error) {
    res.status(500).send({ message: "error requesting ride", error });
  }
}

export async function addReview(req: Request<Id, {}, Ride>, res: Response) {
  try {
    const { id } = req.params;
    const { review, rating } = req.body;
    console.log(`review : ${review} rating: ${rating}`);
    await rideServices.addReview({ id, review, rating });
    return res.status(201).send({ message: "set review" });
  } catch (error) {
    res.status(500).send({ message: "could not able to set review", error });
  }
}
