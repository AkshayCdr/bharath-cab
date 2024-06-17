export default function DriverDetails({ driverDetails }) {
  return (
    <div>
      <ul>
        <li>{driverDetails.name}</li>
        <li>{driverDetails.phone}</li>
      </ul>
    </div>
  );
}
