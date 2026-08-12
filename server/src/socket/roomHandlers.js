import { createRoom, joinRoom } from "../game/roomService.js"
import { supabase } from "../utils/supabase.js";

export function registerRoomHandlers(io, socket) {
    socket.on("createRoom", async (_, callback) => {
        try {
            const { data: profile } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", socket.user.id)
                .single();
            
            const room = createRoom({ userId: socket.user.id, username: profile.username });

            if (typeof callback === "function") {
                callback({ 
                    success: true, 
                    roomCode: room.roomId
                });
            }
        } catch (err) {
            console.error("Error creating room:", err);
            if (typeof callback === "function") {
                callback({ success: false, error: err.message });
            }
        }
    });

    socket.on("joinRoom", async ({ roomCode }, callback) => {
        try {
            const { data: profile } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", socket.user.id)
                .single();
            
            const room = joinRoom({userId: socket.user.id, username: profile.username, roomId: roomCode});

            if (typeof callback === "function") {
                callback({ 
                    success: true, 
                    roomCode: room.roomId
                });
            }
            
        } catch (err) {
            console.error("Error joining room:", err);
            if (typeof callback === "function") {
                callback({ success: false, error: err.message });
            }
        }
    })
}