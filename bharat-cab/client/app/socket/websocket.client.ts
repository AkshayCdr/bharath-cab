import { io } from "socket.io-client";

import { config } from "~/utils/config";

const getAuth = () => localStorage.getItem("auth");

export const socket = io(config.API_KEY, {
    withCredentials: true,
    auth: { token: getAuth() },
});
