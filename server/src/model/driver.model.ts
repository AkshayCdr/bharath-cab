import { QueryResult } from "pg";
import { pool } from "../config/db";

import { Id } from "../types/id";
import { Driver } from "../dtos/driver.dtos";

const client = pool.connect();

export async function createDriver(driver: Driver): Promise<string> {
  try {
    const query = `INSERT INTO driver (cab_type, cab_regno, status, account_id, name, email, phone) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`;
    const values = [
      driver.cabType,
      driver.cabRegNo,
      driver.status,
      driver.accountId,
      driver.name,
      driver.email,
      driver.phone,
    ];
    const result: QueryResult<Id> = await (await client).query(query, values);
    return result.rows[0].id;
  } catch (error) {
    console.error(error);
    throw new Error("Error inserting into driver");
  }
}
