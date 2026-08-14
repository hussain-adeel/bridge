import { generateRoomCode } from "../utils/helpers.js";
import { roomExists, saveRoom, getRoom } from "../game/state.js";
import { createInitialGameState } from "../game/engine.js";
import { MAX_PLAYERS, ROOM_STATUSES, TEAM_IDS } from "../game/constants.js";

export function createRoom({userId, username, socketId}) {
    const roomCode = generateRoomCode();

    console.log("[Bridge Server] Creating room for:", username, "with room code:", roomCode);
    
    // Make Inital Room & Game State
    const newRoom = {
        roomState: {
            roomCode: roomCode,
            status: ROOM_STATUSES.LOBBY,
            host: userId,
            players: [
                {id: userId, username: username, socketId: socketId, isReady: false, index: 0, teamId: TEAM_IDS.ONE, isConnected: true}
            ]
        },
        gameState: createInitialGameState()
    };
    
    saveRoom(roomCode, newRoom);
    return {success: true, roomId: roomCode};
}

export function joinRoom({userId, username, socketId, roomId}) {
    if (!roomExists(roomId)) return {success: false, error: "Room does not exist."};
    
    const room = getRoom(roomId);
    const newIndex = room.roomState.players.length;
    if (newIndex >= MAX_PLAYERS) return {success: false, error: "Room is full."};
    if (room.roomState.status != ROOM_STATUSES.LOBBY) return {success: false, error: "Game has already started."};
    
    const teamId = (newIndex % 2 === 0) ? TEAM_IDS.ONE : TEAM_IDS.TWO;

    const newPlayer = {
        id: userId,
        username: username,
        socketId, socketId,
        isReady: false,
        index: newIndex,
        teamId: teamId,
        isConnected: true
    }

    room.roomState.players.push(newPlayer);
    saveRoom(roomId, room);
    
    return {success: true, roomId: roomId};
}

export function disconnectPlayer({socketId}) {

}

export function reconnectPlayer({}) {
    
}
