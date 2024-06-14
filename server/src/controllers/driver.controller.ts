import { Request, Response } from "express";
import { Driver } from "../dtos/driver.dtos";
import { Account } from "../dtos/account.dto";
import { createHash } from "../utils/passwordUtils";
import { account } from "../services/account.services";
import { driver } from "../services/driver.services";

export async function createDriver(
  req: Request<{}, {}, Driver & Account>,
  res: Response
) {
  try {
    const {
      cabType,
      cabRegNo,
      status,
      name,
      email,
      phone,
      username,
      password,
    } = req.body;

    const passwordHash = await createHash(password);
    const accountType = "driver";

    const accountId = await account.create({
      username,
      password: passwordHash,
      accountType,
    });

    const driverId = await driver.create({
      cabType,
      cabRegNo,
      status,
      name,
      email,
      phone,
      accountId,
    });

    res.status(201).send(JSON.stringify({ driverId }));
  } catch (error) {
    res
      .status(500)
      .send({ message: "server error, driver not created", error });
  }
}
