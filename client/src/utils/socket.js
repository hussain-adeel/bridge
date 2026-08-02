import { io } from "socket.io-client";
import { supabase } from "./supabase";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

const getSocketToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
}

export const scoket = io(URL, {
    autoConnect: true,
    auth: async (cb) => {
        const token = await getSocketToken();
        cb({ token });
    }
});