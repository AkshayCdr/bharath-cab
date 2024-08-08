export default function DriverDetails({ driverDetails }) {
  console.log(driverDetails);
  return (
    <div className="driver-details">
      <ul>
        <li>Name: {driverDetails.name}</li>
        <li>Contact: {driverDetails.phone}</li>
        <li>Cab-Type: {driverDetails.cab_type}</li>
        <li>Cab-Reg.no: {driverDetails.cab_regno}</li>
      </ul>
    </div>
  );
}
