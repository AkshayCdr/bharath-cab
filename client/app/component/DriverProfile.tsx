export default function DriverProfile({ driverData }) {
  console.log(driverData);
  return (
    <div className="driver-profile">
      <ul key={driverData.account_id}>
        <li>Name: {driverData.name}</li>
        <li>Cab: {driverData.cab_type}</li>
        <li>Cab reg: {driverData.cab_regno}</li>
      </ul>
    </div>
  );
}
