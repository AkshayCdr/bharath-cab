import express from "express";
import UserRouter from "./routes/user.route";

export function createApp() {
  const app = express();

  app.use("/user", UserRouter);

  return app;
}
