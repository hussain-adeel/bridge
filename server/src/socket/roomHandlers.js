import { createRoom } from "../game/roomService.js"
import { supabase } from "../utils/supabase.js";

export function registerRoomHandlers(io, socket) {
    socket.on("createRoom", async (_, callback) => {
        const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", socket.user.id)
            .single();
        
        createRoom()
    })
}