import { Request, Response } from "express";

export async function getUser(req: Request, res: Response) {
  res.send([]);
}

export async function createUser(req: Request, res: Response) {
  res.send("created success");
}
