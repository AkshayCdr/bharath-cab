import express from "express";
import UserRouter from "./routes/user.route";
import rideRouter from "./routes/ride.route";
import sessionRoute from "./routes/session.route";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/user", UserRouter);
  app.use("/ride/", rideRouter);
  app.use("/session", sessionRoute);

  return app;
}
