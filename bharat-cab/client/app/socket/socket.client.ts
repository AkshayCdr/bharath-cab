import { io } from "socket.io-client";
import { config } from "~/utils/config";

// const getAuth = () => localStorage.getItem("auth");

// class Socket {
//     socket = null;

//     constructor() {
//         this.socket = io(config.API_KEY, {
//             withCredentials: true,
//             auth: { token: getAuth() },
//         });
//     }

//     setLocalStorage(token) {
//         localStorage.setItem("auth", token);
//     }

//     reInitializeWithToken(token) {
//         this.setLocalStorage(token);
//         if (this.socket) this.socket.disconnect();

//     }

// }

let socket = null;

function initializeSocket() {
    const authToken = localStorage.getItem("auth");
    socket = io(config.API_KEY, {
        withCredentials: true,
        auth: { token: authToken },
    });

    socket.on("connect", () => {
        console.log("Connected to socket with auth token:", authToken);
    });

    return socket;
}

export function setAuthAndReinitializeSocket(authToken) {
    localStorage.setItem("auth", authToken);

    if (socket) {
        socket.disconnect();
    }

    initializeSocket();
}

initializeSocket();

export default socket;

// let socket = null;

// function initializeSocket() {
//     if (!socket) {
//         const authToken = localStorage.getItem("auth");
//         socket = io(config.API_KEY, {
//             withCredentials: true,
//             auth: { token: authToken },
//         });

//         socket.on("connect", () => {
//             console.log("Connected to socket with auth token:", authToken);
//         });
//     }
//     return socket;
// }

// export function setAuthAndReinitializeSocket(authToken) {
//     localStorage.setItem("auth", authToken);

//     if (socket) {
//         socket.disconnect();
//         socket = null; // Set the socket to null to allow reinitialization
//     }

//     return initializeSocket(); // Reinitialize the socket
// }

// export default initializeSocket(); // Export the singleton instance
