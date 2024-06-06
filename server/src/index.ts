import { createApp } from "./createApp";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

createApp().listen(PORT, () => console.log("listening to ", PORT));
