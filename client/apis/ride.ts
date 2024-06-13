// const addr = window.location.hostname + ":3000";

async function setLocation(locationData) {
  const response = await fetch("http://localhost:3000/ride", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(locationData), // Convert locationData to a JSON string
  });
  if (!response.ok) {
    console.error(
      "Failed to set location",
      response.status,
      response.statusText
    );
    return;
  }
  const { id } = await response.json();
  return id;
}

async function getRideDetails(rideId) {
  const response = await fetch(`http://localhost:3000/ride/${rideId}`);
  if (!response.ok) {
    console.error(response.status, response.statusText);
    return;
  }
  const data = await response.json();
  console.log(data);
  return data;
}

export const ride = {
  setLocation,
  getRideDetails,
};
