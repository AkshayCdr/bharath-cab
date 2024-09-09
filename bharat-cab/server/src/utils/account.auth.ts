import { NextFunction, Request, Response } from "express";
import { isSessionExist } from "../model/session.model";

export async function validateSession(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const sessionId = req.cookies?.sessionId;

        if (!sessionId)
            return res.status(401).send({ mesage: "user unauthenticated" });

        const user = await isSessionExist(sessionId);

        if (!user) return res.status(401).send({ mesage: "invalid user" });

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
