import { Router } from "express";
import {
  getRide,
  insertIntoRide,
  requestForRide,
} from "../controllers/ride.controller";

const route = Router();

route.post("/", insertIntoRide);

route.get("/:id", getRide);

route.patch("/:id", requestForRide);

export default route;
