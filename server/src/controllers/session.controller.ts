import { CookieOptions, Request, Response } from "express";
import { Session } from "../dtos/session.dto";
import { verifyPassword } from "../utils/passwordUtils";
import { account } from "../services/account.services";
import { session } from "../services/session.service";
import { Id } from "../types/id";
import { getAccountTypeTable } from "../model/session.model";

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

        if (!passwordHash)
            res.status(500).send({ message: "password not exist" });

        const match = await verifyPassword(password, passwordHash);

        if (!match)
            return res.status(401).send({ message: "invalid password" });

        const id = await account.getId(username);

        const sessionId = await session.add(id);

        const accountType = await account.type(id);

        const options: CookieOptions = {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        };

        res.cookie("sessionId", sessionId, options);
        res.cookie("accountId", id, options);
        res.cookie("accountType", accountType, options);

        res.status(200).send({ message: "session set" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Invalid " });
    }
}

export async function deleteSession(req: Request, res: Response) {
    try {
        console.log("inside delete session");

        const { id } = req.params;

        const options: CookieOptions = {
            maxAge: 0,
        };

        res.cookie("sessionId", "", options);
        res.cookie("accountId", "", options);
        res.cookie("accountType", "", options);

        await session.deleteSession(id);

        console.log("session delete");
        res.status(200).send({ message: "logged out" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "error loggin out user" });
    }
}

export async function getAccountType(req: Request, res: Response) {
    try {
        const sessionId = req.cookies.sessionId;
        console.log(sessionId);
        const accountType = await getAccountTypeTable(sessionId);
        res.status(200).json({ accountType });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "error getting account type" });
    }
}
