import { Router } from "express";
import { insertIntoRide } from "../controllers/ride.controller";

const route = Router();

route.post("/", insertIntoRide);

export default route;
