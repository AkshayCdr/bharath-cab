export async function getDetails(id: string) {
  const response = await fetch(`http://localhost:3000/user/${id}`);
  if (!response.ok) {
    console.error("Failed to get users", response.status, response.statusText);
    return;
  }
  const userData = await response.json();

  return userData;
}

export const user = {
  getDetails,
};
