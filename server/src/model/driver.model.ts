import { QueryResult } from "pg";
import { pool } from "../db";

import { Id } from "../types/id";
import { Driver } from "../dtos/driver.dtos";
import { account } from "../services/account.services";

const client = pool.connect();

export async function createDriver(driver: Driver): Promise<string> {
    try {
        const query = `INSERT INTO driver (cab_type, cab_regno, status, account_id, name, email, phone) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING account_id AS id`;
        const values = [
            driver.cabType,
            driver.cabRegNo,
            driver.status,
            driver.accountId,
            driver.name,
            driver.email,
            driver.phone,
        ];
        const result: QueryResult<Id> = await (
            await client
        ).query(query, values);
        return result.rows[0].id;
    } catch (error) {
        console.error(error);
        throw new Error("Error inserting into driver");
    }
}

export async function getDriver(accountId: string): Promise<Driver> {
    try {
        const query = `SELECT * FROM DRIVER WHERE account_id = $1`;
        const values = [accountId];
        const result: QueryResult<Driver> = await (
            await client
        ).query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw new Error("Error getting driver driver");
    }
}
