import { Request, Response } from "express";
import { Session } from "../dtos/session.dto";
import { verifyPassword } from "../utils/passwordUtils";
import { account } from "../services/account.services";
import { session } from "../services/session.service";

export async function insertIntoSession(
  req: Request<{}, {}, Session>,
  res: Response
) {
  try {
    const { username, password } = req.body;

    const isUserExist = await account.checkUsername(username);

    if (!isUserExist)
      return res.status(401).send({ message: "invalid username" });

    const passwordHash = await account.getPassword(username);

    if (!passwordHash) res.status(500).send({ message: "password not exist" });

    const match = await verifyPassword(password, passwordHash);

    if (!match) return res.status(401).send({ message: "invalid password" });

    const id = await account.getId(username);

    const sessionId = await session.add(id);

    const accountType = await account.type(id);

    res.cookie("sessionId", sessionId);
    res.cookie("userId", id);
    res.cookie("accountType", accountType);

    res.status(200).send({ id, accountType });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}
