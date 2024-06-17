import { Ride } from "../dtos/ride.dto";
import { pool } from "../config/db";
import { QueryResult } from "pg";
import { Id } from "../types/id";

const client = pool.connect();

export async function insertIntoRideTable(ride: Ride): Promise<string> {
  try {
    console.log("inside model");
    const query = `INSERT INTO RIDE (user_id,source, destination,price) VALUES ($1,
            POINT($2,$3), 
            POINT($4, $5),
            $6) RETURNING id;
        `;
    const values = [
      ride.userId,
      ride.source.longitude,
      ride.source.latitude,
      ride.destination.longitude,
      ride.destination.latitude,
      ride.price,
    ];
    const result: QueryResult<Id> = await (await client).query(query, values);
    console.log("succesffully insetd");
    console.log("id is ", result.rows[0].id);
    return result.rows[0].id;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating ride");
  }
}

export async function getFromRideTable(id: string): Promise<Ride> {
  try {
    const query = `SELECT source,destination,price FROM RIDE WHERE id = $1`;
    const values = [id];
    const result: QueryResult<Ride> = await (await client).query(query, values);
    console.log(result.rows);
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error("Error getting data from ride");
  }
}
