import { QueryResult } from "pg";
import { Id } from "../types/id";

import { pool } from "../config/db";
const client = pool.connect();

export async function isSessionExist(id: string): Promise<boolean> {
    try {
        const query = `SELECT 1 FROM session WHERE id = $1;`;
        const values = [id];
        const result: QueryResult<Id> = await (
            await client
        ).query(query, values);

        if (result.rowCount) return true;
        return false;
    } catch (error) {
        console.log(error);
        throw new Error("fetching sesson failed");
    }
}

export async function addSession(accountId: string): Promise<string> {
    try {
        const query = `INSERT INTO session (account_id) VALUES ($1) RETURNING id`;
        const values = [accountId];
        const result: QueryResult<Id> = await (
            await client
        ).query(query, values);
        return result.rows[0].id;
    } catch (error) {
        console.log(error);
        throw new Error("adding session falied");
    }
}

export async function deleteSessionFromTable(id: string): Promise<void> {
    try {
        const query = `DELETE FROM session WHERE id = $1;`;
        const values = [id];
        await (await client).query(query, values);
    } catch (error) {
        console.log(error);
        throw new Error("fetching sesson failed");
    }
}

export async function getAccountTypeTable(id: string): Promise<string> {
    try {
        const query = `select account_type from account join  session on session.account_id =  account.id where session.id = $1`;
        const result = await (await client).query(query, [id]);
        return result.rows[0].account_type;
    } catch (error) {
        console.error(error);
        throw new Error("cannot get account type tab;e");
    }
}

export async function getAccountIdTable(id: string): Promise<string> {
    try {
        const query = `select account_id from session where id = $1`;
        const result = await (await client).query(query, [id]);
        return result.rows[0].account_id;
    } catch (error) {
        console.error(error);
        throw new Error("cannot get account type tab;e");
    }
}
