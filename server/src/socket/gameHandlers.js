import { SOCKET_EVENTS } from "../../../shared/gameConstants.js";
import { emitRoomStateUpdated } from "./roomStateEmitter.js";
import { bid, bidPass } from "../services/gameService.js";

export function registerGameHandlers(io, socket) {
    socket.on(SOCKET_EVENTS.BID, async ({ roomCode, tricks, suit } = {}, callback = () => {}) => {
        try {
            const result = bid({
                userId: socket.user.id,
                roomCode,
                tricks,
                suit,
            });

            if (!result.success) {
                callback(result);
                return;
            }

            emitRoomStateUpdated(io, result.roomCode);
            callback(result);
        }
        catch (err) {
            console.error("Error placing bid:", err);
            callback({ success: false, error: err.message });
        }
    })
}
