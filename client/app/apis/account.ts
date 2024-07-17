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

  console.log(response.headers.get("set-cookie"));

  return response.json();
}

export const account = {
  login,
};
