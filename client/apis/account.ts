async function login(userDetails) {
  const response = await fetch("http://localhost:3000/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails), // Convert locationData to a JSON string
  });

  if (!response.ok) throw new Error("login error");

  // const { id, accountType } = await response.json();

  // return id;
  return response.json();
}

export const account = {
  login,
};
