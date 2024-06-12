import { createApp } from "./createApp";
import dotenv from "dotenv";
import http from "http";
import { createSchema } from "./migrations/table.migrations";
dotenv.config();

const PORT = process.env.PORT;

const app = createApp();

const server = http.createServer(app);

createSchema()
  .then((res) => console.log("table created"))
  .catch(() => console.log("error creating table"));

server.listen(PORT, () => console.log("listening to ", PORT));
