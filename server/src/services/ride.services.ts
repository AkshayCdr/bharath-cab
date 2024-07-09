import { Review } from "../dtos/rating.dtos";
import { LocationData, Ride } from "../dtos/ride.dto";
import { User } from "../dtos/user.dto";
import {
  getFromRideTable,
  getRideAndUserFromTable,
  insertIntoRideTable,
  updateReview,
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

async function update(rideId: string, driverId: string): Promise<void> {
  return updateRideTable(rideId, driverId);
}

async function addReview(rideDetails: Review): Promise<void> {
  return updateReview(rideDetails);
}

async function del(): Promise<void> {}

function findPrice(distance: number): number {
  const minFee = 10;
  const distanceToPrice = {};
  return minFee + 0;
}

export const rideServices = {
  create,
  read,
  update,
  del,
  findPrice,
  getRideAndUser,
  addReview,
};
