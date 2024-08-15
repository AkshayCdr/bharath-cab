import dotenv from "dotenv";
import path from "node:path";

export const user = process.env.DB_USER;
export const host = process.env.DB_HOST;
export const database = process.env.DB_DATABASE;
export const password = process.env.DB_PASSWORD;
export const port = Number(process.env.DB_PORT);
export const openPort = Number(process.env.PORT);
