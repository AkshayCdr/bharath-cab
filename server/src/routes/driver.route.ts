import { Router } from "express";
import { createDriver, getDriver } from "../controllers/driver.controller";

const route = Router();

route.post("/", createDriver);
route.get("/:id", getDriver);

export default route;
