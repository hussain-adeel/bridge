import { io } from "socket.io-client";
import { supabase } from "./supabase.js";
import { SOCKET_EVENTS } from "../../../shared/gameConstants.js";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

const getSocketToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
}

export const socket = io(URL, {
    autoConnect: false,
    auth: async (cb) => {
        const token = await getSocketToken();
        cb({ token });
    }
});

socket.on("disconnect", (reason) => {
    console.warn("Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
    console.error("Socket Connection Failed:", err.message);
});

socket.io.on("reconnect_attempt", () => {
    console.log("Trying to reconnect...");
});

socket.io.on("reconnect", () => {
    console.log("Socket reconnected:", socket.id);
});

socket.io.on("reconnect_failed", () => {
    console.error("Socket reconnection failed.");
});

// Utility Function(s)
export function emitAsync(eventName, data) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("Unable to reach the game server. Please try again."));
        }, 10000);

        socket.emit(eventName, data, (response) => {
            clearTimeout(timeout);
            if (response?.success) resolve(response); 
            else reject(new Error(response?.error || "Unknown socket error"));
        });
    });
}

export { SOCKET_EVENTS };
