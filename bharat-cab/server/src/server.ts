import { createApp } from "./createApp";

import http from "http";
import "./migrations/table.migrations";
import { createSocket } from "./socket";
import path from "node:path";

import { Server } from "socket.io";

// import { openPort } from "./config/config";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), "../.env") });

const PORT = process.env.PORT || 3000;

const app = createApp();

const server = http.createServer(app);

const io: Server = createSocket(server);

server.listen(PORT, () => console.log("listening to ", PORT));

export { io };
