const addr = window.location.hostname + ":3000";

async function setLocation(data) {
  const reponse = await fetch(addr, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
}

async function getRideDetails() {}

export const ride = {
  setLocation,
  getRideDetails,
};
