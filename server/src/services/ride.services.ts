import { LocationData, Ride } from "../dtos/ride.dto";
import { getFromRideTable, insertIntoRideTable } from "../model/ride.model";

async function create(ride: any): Promise<string> {
  return insertIntoRideTable(ride);
}

async function read(id: string): Promise<Ride> {
  return await getFromRideTable(id);
}
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
