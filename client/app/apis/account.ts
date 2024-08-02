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

async function logout(id, cookie) {
  const response = await fetch(`http://localhost:3000/session/${id}`, {
    method: "DELETE",
    headers: {
      Cookie: cookie,
    },
    credentials: "include",
  });

  if (!response.ok) return null;

  return response;
}

export const account = {
  login,
  logout,
};
