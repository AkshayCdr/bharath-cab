import { Request, Response } from "express";
import { Session } from "../dtos/session.dto";

export async function insertIntoSession(req: Request<Session>, res: Response) {
  //get username and password
  const { username, password } = req.params;

  //check username and password exist

  //add to session
}
