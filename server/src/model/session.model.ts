import { QueryResult, QueryResultRow } from "pg";
import { pool } from "../config/db";

export async function excecuteQuery<T>(
    query: string,
    values: any[]
): Promise<QueryResult<QueryResultRow>> {
    try {
        const client = await pool.connect();
        return await client.query(query, values);
    } catch (error) {
        console.error(error);
        throw new Error("Query failed");
    }
}

export async function isSessionExist(id: string): Promise<boolean> {
    const query = `SELECT 1 FROM session WHERE id = $1;`;
    const result = await excecuteQuery(query, [id]);

    if (result.rowCount) return true;

    return false;
}

export async function addSession(accountId: string): Promise<string> {
    const query = `INSERT INTO session (account_id) VALUES ($1) RETURNING id`;
    const result = await excecuteQuery(query, [accountId]);
    return result.rows[0].id;
}

export async function deleteSessionFromTable(id: string): Promise<void> {
    const query = `DELETE FROM session WHERE id = $1;`;
    const values = [id];
    await excecuteQuery(query, values);
}

export async function getAccountTypeTable(id: string): Promise<string> {
    const query = `select account_type from account join  session on session.account_id =  account.id where session.id = $1`;
    const result = await excecuteQuery(query, [id]);
    return result.rows[0].account_type;
}
