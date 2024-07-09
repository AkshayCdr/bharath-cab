import { Router } from "express";
import {
  getRide,
  insertIntoRide,
  requestForRide,
  addReview,
} from "../controllers/ride.controller";

const route = Router();

route.post("/", insertIntoRide);

route.get("/:id", getRide);

route.patch("/:id", requestForRide);

route.patch("/:id/review", addReview);

export default route;
