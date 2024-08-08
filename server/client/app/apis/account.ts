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

async function getAccountType(cookie) {
    const response = await fetch(`http://localhost:3000/session/account-type`, {
        method: "GET",
        headers: {
            Cookie: cookie,
        },
        credentials: "include",
    });

    if (!response.ok) return null;

    const accountType = await response.json();

    if (!accountType) return null;

    return accountType;
}

export const account = {
    login,
    logout,
    getAccountType,
};
