export default function Modal({ userData, driverId, onClick }) {
  console.log(userData);

  return (
    <div className="">
      <input type="hidden" name="driverId" defaultValue={driverId} />
      <input type="hidden" name="userId" defaultValue={userData.id} />
      <div className="">
        <div>
          <div>$</div>
          <div>{userData?.price}</div>
        </div>
        <div>
          <div>{userData?.source?.x}</div>
          <div>{userData?.destination?.x}</div>
        </div>
      </div>
      <button type="submit" onClick={onClick}>
        Accept Ride
      </button>
    </div>
  );
}
