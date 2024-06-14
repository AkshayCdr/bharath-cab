import { Router } from "express";
import { createDriver } from "../controllers/driver.controller";

const route = Router();

route.post("/", createDriver);

route.get("/:id");

export default route;
