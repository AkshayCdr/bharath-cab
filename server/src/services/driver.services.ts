import { Driver } from "../dtos/driver.dtos";
import { createDriver, getDriver } from "../model/driver.model";
import { account } from "./account.services";

async function create(driver: Driver): Promise<string> {
  return createDriver(driver);
}

async function get(accountId: string): Promise<Driver> {
  return getDriver(accountId);
}

export const driver = {
  create,
  get,
};
