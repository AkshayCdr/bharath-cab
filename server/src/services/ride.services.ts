import { Driver } from "../dtos/driver.dtos";
import { Review } from "../dtos/rating.dtos";
import { LocationData, Ride } from "../dtos/ride.dto";
import { User } from "../dtos/user.dto";
import {
  getFromRideTable,
  getRideAndDriverFromTable,
  getRideAndUserFromTable,
  getStatusFromRide,
  insertIntoRideTable,
  updateReview,
  updateRideStatus,
  updateRideTable,
} from "../model/ride.model";

async function create(ride: any): Promise<string> {
  return insertIntoRideTable(ride);
}

async function read(id: string): Promise<Ride> {
  return getFromRideTable(id);
}

async function getRideAndUser(id: string): Promise<Ride & User> {
  return getRideAndUserFromTable(id);
}

async function getRideAndDriver(id: string): Promise<Ride & Driver> {
  return getRideAndDriverFromTable(id);
}

async function update(rideId: string, driverId: string): Promise<void> {
  return updateRideTable(rideId, driverId);
}

async function addReview(rideDetails: Review): Promise<void> {
  return updateReview(rideDetails);
}

async function updateStatus(id: string, status: string): Promise<void> {
  return updateRideStatus(id, status);
}

async function getStatus(id: string): Promise<{ status: string }> {
  return getStatusFromRide(id);
}

async function del(): Promise<void> {}

async function findPrice(source: number, destination: number): Promise<number> {
  const minFee = 10;
  const distance = await findDistance(source, destination);
  const distanceToPrice = {};
  return minFee + 0;
}

async function findDistance(
  source: number,
  destination: number
): Promise<void> {}

export const rideServices = {
  create,
  read,
  update,
  del,
  findPrice,
  getRideAndUser,
  getRideAndDriver,
  addReview,
  updateStatus,
  getStatus,
};
