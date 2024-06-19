export default function DriverProfile({ driverData }) {
  return (
    <div>
      <h1>DriverProfile</h1>
      <ul key={driverData.account_id}>
        <li>Name: {driverData.name}</li>
      </ul>
    </div>
  );
}
