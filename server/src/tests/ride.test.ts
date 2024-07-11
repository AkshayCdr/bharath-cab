import { rideServices } from "../services/ride.services";
import { test, assert } from "vitest";

test("update status using given ID", async () => {
  const id = "140e2103-e4f9-4a1f-8611-1a9462bf046a";
  const status = "driver_accepted";
  await rideServices.updateStatus(id, status);
});

test("get status using given id", async () => {
  const id = "140e2103-e4f9-4a1f-8611-1a9462bf046a";
  const data = await rideServices.getStatus(id);
  console.log(data);
});
