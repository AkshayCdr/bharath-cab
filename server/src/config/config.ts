import dotenv from "dotenv";

dotenv.config();

console.log(dotenv.config());

// export const config = {
//     dbConfig: {
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.DB_DATABASE,
//         password: process.env.DB_PASSWORD,
//         port: Number(process.env.DB_PORT),
//     },
//     port: 3000,
// };

export const user = process.env.DB_USER;
export const host = process.env.DB_HOST;
export const database = process.env.DB_DATABASE;
export const password = process.env.DB_PASSWORD;
export const port = Number(process.env.DB_PORT);
