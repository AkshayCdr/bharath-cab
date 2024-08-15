import path from "path";
import fs from "fs";
import { pool } from "../db";

const client = pool.connect();

export async function createSchema(): Promise<void> {
    try {
        const __dirname = path.resolve(".");
        const filePath = path.join(__dirname, "migrations", "createTable.sql");
        // const filePath = path.join( "createTable.sql");

        const query = fs.readFileSync(filePath, "utf-8");
        const dbClient = await client;
        await dbClient.query(query);
    } catch (error) {
        throw error;
    }
}

createSchema()
    .then(() => console.log("Table created"))
    .catch((err) => console.error("Error creating table:", err));
