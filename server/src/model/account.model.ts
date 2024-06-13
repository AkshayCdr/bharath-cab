import { QueryResult } from "pg";
import { Account } from "../dtos/account.dto";
import { Id } from "../types/id";
import { pool } from "../config/db";

const client = pool.connect();

export async function createAccount(account: Account): Promise<string> {
  try {
    const query = `INSERT INTO ACCOUNT (account_type, username,password) VALUES (
               $1,
               $2,
               $3)
                RETURNING id;
           `;
    const values = [account.accountType, account.username, account.password];
    const result: QueryResult<Id> = await (await client).query(query, values);
    return result.rows[0].id;
  } catch (error) {
    console.error(error);
    throw new Error("failed to create account");
  }
}
