import dotenv from "dotenv";
import { PoolConfig } from "pg";

dotenv.config();

interface config {
    dbConfig: DbConfig;
    port: number;
}

interface DbConfig {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
}

export const config: { dbConfig: DbConfig; port: number } = {
    dbConfig: {
        user: String(process.env.DB_USER),
        host: String(process.env.DB_HOST),
        database: String(process.env.DB_DATABASE),
        password: String(process.env.DB_PASSWORD),
        port: Number(process.env.DB_PORT),
    },
    port: 3000,
};
