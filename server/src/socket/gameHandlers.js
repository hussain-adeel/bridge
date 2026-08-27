import { MATCH_END_DURATION_MS, ROUND_END_DURATION_MS, SOCKET_EVENTS, TRICK_RESULT_DURATION_MS } from "../../../shared/gameConstants.js";
import { emitRoomStateUpdated } from "./roomStateEmitter.js";
import { bid, bidPass, playCard, resolveTrick, startNextRound, returnRoomToLobby } from "../services/gameService.js";

function schedulePostRoundTransition(io, result) {
    if (result.shouldStartNextRound) {
        setTimeout(() => {
            const roundResult = startNextRound({
                roomCode: result.roomCode,
            });

            if (roundResult.success) {
                emitRoomStateUpdated(io, roundResult.roomCode);
            }
        }, ROUND_END_DURATION_MS);
    }

    if (result.shouldReturnToLobby) {
        setTimeout(() => {
            const lobbyResult = returnRoomToLobby({
                roomCode: result.roomCode,
            });

            if (lobbyResult.success) {
                emitRoomStateUpdated(io, lobbyResult.roomCode);
            }
        }, MATCH_END_DURATION_MS);
    }
}

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

            if (result.shouldResolveTrick) {
                setTimeout(async () => {
                    try {
                        const trickResult = await resolveTrick({
                            roomCode: result.roomCode,
                        });

                        if (trickResult.success) {
                            emitRoomStateUpdated(io, trickResult.roomCode);
                            schedulePostRoundTransition(io, trickResult);
                        }
                    } catch (err) {
                        console.error("Error resolving trick:", err);
                    }
                }, TRICK_RESULT_DURATION_MS);
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
