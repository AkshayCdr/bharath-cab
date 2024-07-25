export default function Modal({ userData, driverId, onClick }) {
  console.log(userData);

  return (
    <div className="ride-details">
      <input type="hidden" name="driverId" defaultValue={driverId} />
      <input type="hidden" name="userId" defaultValue={userData.id} />
      <p className="ride-details-input">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          id=""
          defaultValue={userData.name}
          readOnly
        />
        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          name="phone"
          id=""
          defaultValue={userData.phone}
          readOnly
        />
        <label htmlFor="price">Price:</label>
        <input
          type="text"
          name="price"
          id=""
          defaultValue={userData.price}
          readOnly
        />
      </p>
      <button type="submit" onClick={onClick}>
        Accept Ride
      </button>
    </div>
  );
}
