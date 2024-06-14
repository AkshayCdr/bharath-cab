import { Driver } from "../dtos/driver.dtos";
import { createDriver } from "../model/driver.model";

async function create(driver: Driver): Promise<string> {
  return createDriver(driver);
}

async function get() {}

export const driver = {
  create,
  get,
};
