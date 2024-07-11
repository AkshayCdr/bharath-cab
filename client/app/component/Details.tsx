import { Form } from "@remix-run/react";

export default function RideDetails({
  rideDetails,
  sourceName,
  destinationName,
}) {
  console.log(rideDetails);

  return (
    <div className="flex flex-col m-4 p-2 ">
      <input type="hidden" name="rideId" defaultValue={rideDetails.id} />
      <p className="ride-details-input flex flex-col gap-6">
        <div className="flex flex-col">
          <label htmlFor="source " className="text-2xl">
            Source
          </label>
          <input type="text" name="sourceName" value={sourceName} readOnly />
        </div>
        <div className="flex flex-col">
          <label htmlFor="destination" className="text-2xl">
            Destination
          </label>
          <input
            type="text"
            name="destinationName"
            id=""
            value={destinationName}
            readOnly
          />
        </div>
        <div className="flex">
          <label htmlFor="price" className="text-2xl">
            $
          </label>
          <input
            type="text"
            name="price"
            id=""
            value={rideDetails.price}
            readOnly
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="driver" className="text-2xl">
            Driver Name
          </label>
          <input
            type="text"
            name="driver"
            id=""
            value={rideDetails.name}
            readOnly
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-2xl">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            id=""
            value={rideDetails.phone}
            readOnly
          />
        </div>
      </p>
    </div>
  );
}
