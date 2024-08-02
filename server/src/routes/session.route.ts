import { Router } from "express";
import {
  deleteSession,
  insertIntoSession,
} from "../controllers/session.controller";
import { validateSession } from "../utils/account.auth";

const route = Router();

route.post("/", insertIntoSession);
route.delete("/:id", validateSession, deleteSession);

export default route;
