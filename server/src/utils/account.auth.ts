import { NextFunction, Request, Response } from "express";
import { isSessionExist } from "../model/session.model";

export async function validateSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // if (!req.cookies)
    //   return res.status(401).send({ mesage: "user unauthenticated" });

    // if (!req.cookies.sessionId)
    //   return res.status(401).send({ mesage: "user unauthenticated" });

    // const user = await isSessionExist(req.cookies.sessionId);

    // if (!user) return res.status(401).send({ mesage: "invalid user" });

    // console.log(`cokies inside validates sessoion ${req}`);
    // console.log(req.headers);
    // console.log(req);

    // console.log(req.cookies.sessionId);

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
