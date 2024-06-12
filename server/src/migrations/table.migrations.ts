import path from "path";
import fs from "fs";
import { pool } from "../config/db";
const client = pool.connect();

export async function createSchema(): Promise<void> {
  const __dirname = path.resolve(".");
  const filePath = path.join(__dirname, "src", "migrations", "createTable.sql");
  const query = fs.readFileSync(filePath, "utf-8");
  const result = await (await client).query(query);
  // const query = `SELECT create_tables_procedure()`;
  // const result = await (await client).query(query);
  // console.table(result);
}
