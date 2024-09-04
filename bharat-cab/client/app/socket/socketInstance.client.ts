import { io } from "socket.io-client";
import { config } from "~/utils/config";

const socketIntance = (() => {
    let instance;

    function createInstance() {
        return io(config.API_KEY, {
            withCredentials: true,
            auth: { token: localStorage.getItem("auth") },
        });
    }

    return {
        getInstance: () => {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    };
})();

export default socketIntance;
