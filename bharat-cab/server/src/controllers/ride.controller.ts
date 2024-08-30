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
        console.log("adding ride");
        const rideId = await rideServices.create(newRide);
        console.log("added ride");
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
        console.error(error);
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

export async function requestForRide(
    req: Request<Id, {}, Ride>,
    res: Response
) {
    try {
        const { id } = req.params;

        const { status } = req.body;

        console.log("inside controller requesting for ride ");

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
        console.error(error);
        res.status(500).send({
            message: "could not able to set review",
        });
    }
}

export async function calculateDistance(req: Request, res: Response) {
    try {
        console.log("inside calculate distance ");

        const { source, destination } = req.body;

        const distance = await rideServices.getDistance(
            rideServices.renameCoordinates(source),
            rideServices.renameCoordinates(destination)
        );

        const fixedDistance = parseFloat(distance.toFixed(2));

        const price = rideServices.findPrice(fixedDistance);

        res.status(200).send({ distance: fixedDistance, price });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "calculate data failed" });
    }
}
