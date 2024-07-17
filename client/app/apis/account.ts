async function login(userDetails) {
  const response = await fetch("http://localhost:3000/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
    credentials: "include",
  });

  if (!response.ok) return null;

  return response;
}

export const account = {
  login,
};
