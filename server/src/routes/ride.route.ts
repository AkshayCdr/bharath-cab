import { Router } from "express";
import { getRide, insertIntoRide } from "../controllers/ride.controller";

const route = Router();

route.post("/", insertIntoRide);

route.get("/:id", getRide);

export default route;
