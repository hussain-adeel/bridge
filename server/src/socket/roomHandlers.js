import {
    createRoom,
    joinRoom,
    getRoomGameState,
    readyPlayer,
    changeMatchRounds,
    reconnectPlayer,
    disconnectPlayer,
    leaveRoom,
    startMatch,
} from "../services/roomService.js";
import { emitRoomStateUpdated } from "./roomStateEmitter.js";
import { supabase } from "../utils/supabase.js";
import { SOCKET_EVENTS } from "../../../shared/gameConstants.js";

export function registerRoomHandlers(io, socket) {
    socket.on(SOCKET_EVENTS.CREATE_ROOM, async (_, callback = () => {}) => {
        try {
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", socket.user.id)
                .single();
            
            if (profileError || !profile?.username) throw new Error("Unable to load player profile.");

            const room = createRoom({ userId: socket.user.id, username: profile.username, socketId: socket.id });

            socket.join(room.roomCode);

            callback({ 
                success: true, 
                roomCode: room.roomCode
            });
        } 
        catch (err) {
            console.error("Error creating room:", err);
            callback({ success: false, error: err.message });
        }
    });

    socket.on(SOCKET_EVENTS.JOIN_ROOM, async ({ roomCode } = {}, callback = () => {}) => {
        try {
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", socket.user.id)
                .single();
            
            if (profileError || !profile?.username) throw new Error("Unable to load player profile.");

            const room = joinRoom({userId: socket.user.id, username: profile.username, socketId: socket.id, roomCode});

            if (!room.success) {
                callback(room);
                return;
            }

            socket.join(room.roomCode);
            emitRoomStateUpdated(io, room.roomCode);

            callback({ 
                success: true, 
                roomCode: room.roomCode
            });
            
        } 
        catch (err) {
            console.error("Error joining room:", err);
            callback({ success: false, error: err.message });
        }
    });

    socket.on(SOCKET_EVENTS.GET_ROOM_STATE, async ({ roomCode } = {}, callback = () => {}) => {
        try {
            const response = getRoomGameState({userId: socket.user.id, roomCode});

            if (!response.success) {
                callback(response);
                return;
            }

            callback(response);
        }
        catch (err) {
            console.error("Error fetching room state:", err);
            callback({ success: false, error: err.message });
        }
    });

    socket.on(SOCKET_EVENTS.READY, ({ roomCode } = {}, callback = () => {}) => {
        try {
            const result = readyPlayer({userId: socket.user.id, roomCode});

            if (!result.success) {
                callback(result);
                return;
            }

            emitRoomStateUpdated(io, result.roomCode);
            callback(result);
        }
        catch (err) {
            console.error("Error updating player readiness:", err);
            callback({ success: false, error: err.message });
        }
    });

    socket.on(SOCKET_EVENTS.CHANGE_ROUNDS, ({ roomCode, roundsToWin } = {}, callback = () => {}) => {
        try {
            const result = changeMatchRounds({
                userId: socket.user.id,
                roomCode,
                roundsToWin,
            });

            if (!result.success) {
                callback(result);
                return;
            }

            emitRoomStateUpdated(io, result.roomCode);
            callback(result);
        }
        catch (err) {
            console.error("Error changing match rounds:", err);
            callback({ success: false, error: err.message });
        }
    });

    socket.on(SOCKET_EVENTS.RECONNECT_TO_ROOM, ({ roomCode } = {}, callback = () => {}) => {
        try {
            const result = reconnectPlayer({
                userId: socket.user.id,
                roomCode,
                socketId: socket.id,
            });

            if (!result.success) {
                callback(result);
                return;
            }

            socket.join(result.roomCode);
            emitRoomStateUpdated(io, result.roomCode);
            callback(result);
        }
        catch (err) {
            console.error("Error reconnecting to room:", err);
            callback({ success: false, error: err.message });
        }
    });

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomCode } = {}, callback = () => {}) => {
        try {
            const result = leaveRoom({
                userId: socket.user.id,
                roomCode,
            });

            if (!result.success) {
                callback(result);
                return;
            }

            socket.leave(result.roomCode);
            emitRoomStateUpdated(io, result.roomCode);
            callback(result);
        }
        catch (err) {
            console.error("Error reconnecting to room:", err);
            callback({ success: false, error: err.message });
        }
    });

    socket.on(SOCKET_EVENTS.START_MATCH, async ({ roomCode } = {}, callback = () => {}) => {
        try {
            const result = await startMatch({
                userId: socket.user.id,
                roomCode,
            });

            if (!result.success) {
                callback(result);
                return;
            }

            emitRoomStateUpdated(io, result.roomCode);
            callback(result);
        }
        catch (err) {
            console.error("Error starting match:", err);
            callback({ success: false, error: err.message });
        }
    });
}
