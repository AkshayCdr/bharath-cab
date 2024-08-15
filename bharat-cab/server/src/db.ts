import { Pool } from "pg";

// import { user, host, database, password, port } from "./config";
import dotenv from "dotenv";
import path from "node:path";

// dotenv.config();

dotenv.config({ path: path.join(process.cwd(), "../.env") });

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

// export const pool = new Pool({
//     user,
//     host,
//     database,
//     password,
//     port,
// });

// export const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "postgres",
//     password: "admin@123",
//     port: 5432,
// });
