
import { supabase } from "../utils/supabase.js";

export function registerGameHandlers(io, socket) {
    // socket.on(SOCKET_EVENTS.READ, async ({ roomCode }, callback) => {
    //     try {
    //         const response = getRoomGameState({userId: socket.user.id, roomCode});

    //         if (!response.success) {
    //             if (typeof callback === "function") callback(response);
    //             return;
    //         }

    //         if (typeof callback === "function") {
    //             callback({ 
    //                 success: true, 
    //                 roomState: response.roomState,
    //                 gameState: response.gameState
    //             });
    //         }
    //     }
    //     catch (err) {
    //         console.error("Error fetching room state:", err);
    //         if (typeof callback === "function") {
    //             callback({ success: false, error: err.message });
    //         }
    //     }
    // });
}