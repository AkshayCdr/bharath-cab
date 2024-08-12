import { createApp } from "./createApp";

import http from "http";
import "./migrations/table.migrations";
import { createSocket } from "./socket";
import { config } from "./config/config";

const PORT = config.port;

const app = createApp();

const server = http.createServer(app);

const io = createSocket(server);

server.listen(PORT, () => console.log("listening to ", PORT));

export { io };
