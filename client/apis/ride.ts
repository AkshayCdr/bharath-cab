// const addr = window.location.hostname + ":3000";

async function setLocation(locationData) {
  const response = await fetch("http://localhost:3000/ride", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(locationData),
  });
  if (!response.ok) {
    console.error(
      "Failed to set location",
      response.status,
      response.statusText
    );
    return;
  }
  const { rideId } = await response.json();

  return rideId;
}

async function getRideDetails(rideId: string) {
  const response = await fetch(`http://localhost:3000/ride/${rideId}`);
  if (!response.ok) {
    console.error(response.status, response.statusText);
    return;
  }
  const data = await response.json();

  return data;
}

async function requestForRide(Id) {
  const response = await fetch(`http://localhost:3000/ride/${Id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "request_ride" }),
  });
  if (!response.ok) {
    console.error(
      "failed to request for ride",
      response.status,
      response.statusText
    );
    return;
  }
  const { message } = await response.json();
  console.log("message inside api", message);
  return message;
}

export const ride = {
  setLocation,
  getRideDetails,
  requestForRide,
};
