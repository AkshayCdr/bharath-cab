async function get(id: string, cookie) {
  const response = await fetch(`http://localhost:3000/driver/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: cookie,
    },
  });

  if (!response.ok) {
    console.error(
      "Failed to get driver data",
      response.status,
      response.statusText
    );
    return;
  }
  const driverData = await response.json();
  return driverData;
}

export const driver = {
  get,
};
