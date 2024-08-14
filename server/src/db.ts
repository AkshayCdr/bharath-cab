import { Pool } from "pg";

// import { user, host, database, password, port } from "./config";
import dotenv from "dotenv";

dotenv.config();

console.log(dotenv.config());

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
