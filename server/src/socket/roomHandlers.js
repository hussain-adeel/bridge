import { createRoom, joinRoom } from "../services/roomService.js";
import { supabase } from "../utils/supabase.js";
import { SOCKET_EVENTS } from "../../../shared/gameConstants.js";

export function registerRoomHandlers(io, socket) {
    socket.on(SOCKET_EVENTS.CREATE_ROOM, async (_, callback) => {
        try {
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", socket.user.id)
                .single();
            
            if (profileError || !profile?.username) throw new Error("Unable to load player profile.");

            const room = createRoom({ userId: socket.user.id, username: profile.username, socketId: socket.id });

            socket.join(room.roomCode);

            if (typeof callback === "function") {
                callback({ 
                    success: true, 
                    roomCode: room.roomCode
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
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", socket.user.id)
                .single();
            
            if (profileError || !profile?.username) throw new Error("Unable to load player profile.");

            const room = joinRoom({userId: socket.user.id, username: profile.username, socketId: socket.id, roomCode});

            if (!room.success) {
                if (typeof callback === "function") callback(room);
                return;
            }

            socket.join(room.roomCode);

            if (typeof callback === "function") {
                callback({ 
                    success: true, 
                    roomCode: room.roomCode
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
