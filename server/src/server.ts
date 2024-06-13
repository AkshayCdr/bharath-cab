import { createApp } from "./createApp";
import dotenv from "dotenv";
import http from "http";
import "./migrations/table.migrations";
import { createSocket } from "./socket";
dotenv.config();

const PORT = process.env.PORT;

const app = createApp();

const server = http.createServer(app);

const io = createSocket(server);

server.listen(PORT, () => console.log("listening to ", PORT));

export { io };
