export interface Ride {
  readonly id: string;
  userId: string;
  driverId: string;
  user_id: string;
  status?: RideStatus;
  source: LocationData;
  destination: LocationData;
  price: number;
  rating?: number;
  review?: string;
}

export type LocationData = {
  longitude: number;
  latitude: number;
};

enum RideStatus {
  Success = "SUCCESS",
  OnRide = "ON_RIDE",
  Pending = "PENDING",
}
