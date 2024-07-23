import { rideServices } from "../services/ride.services";
import { test, assert } from "vitest";

test("update status using given ID", async () => {
  const id = "140e2103-e4f9-4a1f-8611-1a9462bf046a";
  const status = "driver_accepted";
  // await rideServices.updateStatus(id, status);
  await rideServices.updateStatus(id, "cancelled");
});

test("get status using given id", async () => {
  const id = "140e2103-e4f9-4a1f-8611-1a9462bf046a";
  const data = await rideServices.getStatus(id);
  console.log(data);
});

test("get distance for given source and destianation", async () => {
  const id = "4279b07d-ea46-418b-b525-e3ce7b65e700";
  const source = { longitude: 77.56197398834188, latitude: 12.942664343103248 };
  const destination = {
    longitude: 77.61327799123202,
    latitude: 12.919910469324924,
  };
  await rideServices.update({ id, source, destination });
});
