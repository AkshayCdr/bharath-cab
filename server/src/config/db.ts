import { Pool } from "pg";

import { user, host, database, password, port } from "./config";

export const pool = new Pool({
    user,
    host,
    database,
    password,
    port,
});

// export const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "postgres",
//     password: "admin@123",
//     port: 5432,
// });
