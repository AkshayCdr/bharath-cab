import { Router } from "express";
import {
  getRide,
  insertIntoRide,
  requestForRide,
  addReview,
  getRideAndDriver,
} from "../controllers/ride.controller";

const route = Router();

route.post("/", insertIntoRide);

route.get("/:id", getRide);

route.get("/:id/driver", getRideAndDriver);

route.patch("/:id", requestForRide);

route.patch("/:id/review", addReview);

export default route;
