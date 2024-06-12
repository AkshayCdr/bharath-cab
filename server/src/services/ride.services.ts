import { LocationData, Ride } from "../dtos/ride.dto";
import { insertIntoRideTable } from "../model/ride.model";

async function create(ride: Ride): Promise<string> {
  return insertIntoRideTable(ride);
}

async function read(): Promise<void> {}
async function update(): Promise<void> {}
async function del(): Promise<void> {}

function findDistance(souce: LocationData, destination: LocationData): number {
  return 0;
}

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
  findDistance,
  findPrice,
};
