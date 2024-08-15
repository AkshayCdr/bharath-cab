import { Router } from "express";
import { createDriver, getDriver } from "../controllers/driver.controller";
import { validateSession } from "../utils/account.auth";

const route = Router();

route.post("/", createDriver);
route.get("/:id", validateSession, getDriver);

export default route;
