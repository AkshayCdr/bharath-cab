import { Ride } from "../dtos/ride.dto";
import { pool } from "../config/db";
import { QueryResult } from "pg";
import { Id } from "../types/id";

const client = pool.connect();

export async function insertIntoRideTable(ride: Ride): Promise<string> {
  const query = `INSERT INTO RIDE (source, destination,price) VALUES (
          POINT($1,$2), 
          POINT($3, $4),
          $5) RETURNING id;
      `;
  const values = [
    ride.source.longitude,
    ride.source.latitude,
    ride.destination.longitude,
    ride.destination.latitude,
    ride.price,
  ];
  const result: QueryResult<Id> = await (await client).query(query, values);
  return result.rows[0].id;
}
