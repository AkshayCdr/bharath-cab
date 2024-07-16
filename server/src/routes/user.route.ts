import { Router } from "express";
import { createUser, getUser } from "../controllers/user.controller";
import { validateSession } from "../utils/account.auth";

const router = Router();

router.get("/:id", validateSession, getUser);
router.post("/", createUser);

export default router;
