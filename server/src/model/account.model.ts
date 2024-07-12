import { QueryResult } from "pg";
import { Account } from "../dtos/account.dto";
import { Id } from "../types/id";
import { pool } from "../config/db";
import { password } from "../types/password";

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

export async function checkAccountExist(username: string): Promise<boolean> {
  try {
    const query = `SELECT 1 FROM ACCOUNT WHERE username = $1;`;
    const values = [username];
    const result = await (await client).query(query, values);
    return result.rows.length > 0;
  } catch (error) {
    console.log(error);
    throw new Error("username check failed");
  }
}

export async function getPasswordFromTable(username: string): Promise<string> {
  try {
    const query = `SELECT password FROM ACCOUNT WHERE username = $1;`;
    const values = [username];
    const result: QueryResult<password> = await (
      await client
    ).query(query, values);
    if (result.rows.length > 0) return result.rows[0].password;
    return "";
  } catch (error) {
    console.log(error);
    throw new Error("fetching password failed");
  }
}

export async function getAccountId(username: string): Promise<string> {
  try {
    const query = `SELECT id FROM ACCOUNT WHERE username = $1;`;
    const values = [username];
    const result: QueryResult<Id> = await (await client).query(query, values);
    return result.rows[0].id;
  } catch (error) {
    console.log(error);
    throw new Error("fetching password failed");
  }
}

export async function getAccountType(id: string): Promise<string> {
  try {
    const query = `SELECT account_type FROM account WHERE id = $1;`;
    const values = [id];
    const result: QueryResult<{ account_type: string }> = await (
      await client
    ).query(query, values);
    return result.rows[0].account_type;
  } catch (error) {
    console.log(error);
    throw new Error("fetching password failed");
  }
}
