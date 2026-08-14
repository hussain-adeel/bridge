import { createRoom, joinRoom } from "../services/roomService.js";
import { supabase } from "../utils/supabase.js";
import { SOCKET_EVENTS } from "../game/constants.js";

export function registerRoomHandlers(io, socket) {
    socket.on(SOCKET_EVENTS.CREATE_ROOM, async (_, callback) => {
        try {
            const { data: profile } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", socket.user.id)
                .single();
            
            const room = createRoom({ userId: socket.user.id, username: profile.username, socketId: socket.id });

            socket.join(room.roomId);

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

    socket.on(SOCKET_EVENTS.JOIN_ROOM, async ({ roomCode }, callback) => {
        try {
            const { data: profile } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", socket.user.id)
                .single();
            
            const room = joinRoom({userId: socket.user.id, username: profile.username, socketId: socket.id, roomId: roomCode});

            socket.join(room.roomId);

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
