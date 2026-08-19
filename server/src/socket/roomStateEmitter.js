import { getRoom, roomExists } from "../game/state.js";
import { getPlayerGameState } from "../services/gameService.js";
import { SOCKET_EVENTS } from "../../../shared/gameConstants.js";

export function emitRoomStateUpdated(io, roomCode) {
    const normalizedRoomCode = roomCode?.trim().toUpperCase();

    if (!normalizedRoomCode || !roomExists(normalizedRoomCode)) return;

    const room = getRoom(normalizedRoomCode);
    const players = room.roomState?.players;

    const publicRoomState = {
        ...room.roomState,
        players: room.roomState.players.map(({ socketId, ...player }) => player),
    };

    players.forEach(player => {
        if (!player.isConnected || !player.socketId) return;

        const playerGameState = getPlayerGameState(room.gameState, player.id);

        io.to(player.socketId).emit(
            SOCKET_EVENTS.ROOM_STATE_UPDATED,
            {
                roomState: publicRoomState,
                gameState: playerGameState,
            }
        );
    });
}