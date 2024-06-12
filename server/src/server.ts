import { createApp } from "./createApp";
import dotenv from "dotenv";
import http from "http";
import "./migrations/table.migrations";
dotenv.config();

const PORT = process.env.PORT;

const app = createApp();

const server = http.createServer(app);

server.listen(PORT, () => console.log("listening to ", PORT));
