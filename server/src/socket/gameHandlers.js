import { SOCKET_EVENTS } from "../../../shared/gameConstants.js";
import { emitRoomStateUpdated } from "./roomStateEmitter.js";
import { bid, bidPass, playCard } from "../services/gameService.js";

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

    socket.on(SOCKET_EVENTS.BID_PASS, async ({ roomCode } = {}, callback = () => {}) => {
        try {
            const result = bidPass({
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
            console.error("Error passing bid:", err);
            callback({ success: false, error: err.message });
        }
    })

    socket.on(SOCKET_EVENTS.PLAY_CARD, async ({ roomCode, cardId } = {}, callback = () => {}) => {
        try {
            const result = playCard({
                userId: socket.user.id,
                roomCode,
                cardId
            });

            if (!result.success) {
                callback(result);
                return;
            }

            emitRoomStateUpdated(io, result.roomCode);
            callback(result);
        }
        catch (err) {
            console.error("Error playing card:", err);
            callback({ success: false, error: err.message });
        }
    })
}
