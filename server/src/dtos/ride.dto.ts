export interface Ride {
    readonly id: string;
    userId: string;
    driverId: string;
    user_id: string;
    status?: RideStatus;
    source: LocationData;
    destination: LocationData;
    price: number;
    rating: number;
    review: string;
}

export type LocationData = {
    longitude: number;
    latitude: number;
};

enum RideStatus {
    Success = "success",
    OnRide = "onride",
    Pending = "pending",
    Requested = "requested",
    Accepted = "driver_accepted",
    Cancelled = "cancelled",
}

export type source = LocationData;
export type destination = LocationData;
