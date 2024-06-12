import express from "express";
import UserRouter from "./routes/user.route";
import rideRouter from "./routes/ride.route";

export function createApp() {
  const app = express();

  app.use("/user", UserRouter);
  app.use("/ride", rideRouter);
  return app;
}
