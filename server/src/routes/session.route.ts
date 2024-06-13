import { Router } from "express";
import { insertIntoSession } from "../controllers/session.controller";

const route = Router();

route.post("/", insertIntoSession);

export default route;
