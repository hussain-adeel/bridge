import { generateRoomCode } from "../utils/helpers.js";
import { roomExists, saveRoom, getRoom } from "../game/state.js";
import { createInitialGameState } from "../game/engine.js";
import { DEFAULT_ROUNDS_TO_WIN, MAX_PLAYERS, ROOM_STATUSES, TEAM_IDS, MATCH_ROUND_OPTIONS } from "../../../shared/gameConstants.js";
import { getPlayerGameState } from "./gameService.js";

function getValidRoom(roomCode) {
    const normalizedRoomCode = roomCode?.trim().toUpperCase();

    if (!normalizedRoomCode || !roomExists(normalizedRoomCode)) return { success: false, error: "Room does not exist" };

    return {
        success: true,
        roomCode: normalizedRoomCode,
        room: getRoom(normalizedRoomCode)
    };
}

export function createRoom({userId, username, socketId}) {
    const roomCode = generateRoomCode();

    console.log("[Bridge Server] Creating room for:", username, "with room code:", roomCode);

    const newRoom = {
        roomState: {
            roomCode: roomCode,
            status: ROOM_STATUSES.LOBBY,
            host: userId,
            roundsToWin: DEFAULT_ROUNDS_TO_WIN,
            players: [
                {id: userId, username: username, socketId: socketId, isReady: false, index: 0, teamId: TEAM_IDS.ONE, isConnected: true}
            ]
        },
        gameState: createInitialGameState()
    };
    
    saveRoom(roomCode, newRoom);
    return {success: true, roomCode};
}

export function joinRoom({userId, username, socketId, roomCode}) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;
    const player = room.roomState.players.find((player) => player.id === userId);

    if (player) {
        player.socketId = socketId;
        player.isConnected = true;
        saveRoom(normalizedRoomCode, room);
        return {success: true, roomCode: normalizedRoomCode};
    }

    const newIndex = room.roomState.players.length;
    if (newIndex >= MAX_PLAYERS) return {success: false, error: "Room is full."};
    if (room.roomState.status !== ROOM_STATUSES.LOBBY) return {success: false, error: "Game has already started."};
    
    const teamId = (newIndex % 2 === 0) ? TEAM_IDS.ONE : TEAM_IDS.TWO;

    const newPlayer = {
        id: userId,
        username: username,
        socketId,
        isReady: false,
        index: newIndex,
        teamId: teamId,
        isConnected: true
    }

    room.roomState.players.push(newPlayer);
    saveRoom(normalizedRoomCode, room);
    
    return {success: true, roomCode: normalizedRoomCode};
}

export function getRoomGameState({userId, roomCode}) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;
    const player = room.roomState.players.find((player) => player.id === userId);

    if (!player) return {success: false, error: "You are not connected to this room."};

    const playerGameState = getPlayerGameState(room.gameState, userId);
    const publicRoomState = {
        ...room.roomState,
        players: room.roomState.players.map(({ socketId, ...player }) => player),
    };

    return {
        success: true,
        roomState: publicRoomState,
        gameState: playerGameState
    }
}

export function disconnectPlayer({socketId}) {

}

export function reconnectPlayer({}) {
    
}

export function readyPlayer({userId, roomCode}) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;

    if (room.roomState.status !== ROOM_STATUSES.LOBBY) return { 
        success: false, 
        error: "Game has already started." 
    };

    const player = room.roomState.players.find((player) => player.id === userId);
    if (!player) return {
        success: false, 
        error: "You are not connected to this room."
    };
    
    // toggle ready
    player.isReady = !player.isReady;

    // not strictly necessary but just to be consistent
    saveRoom(normalizedRoomCode, room);

    return { success: true, roomCode: normalizedRoomCode };

}

export function changeMatchRounds({userId, roomCode, roundsToWin}) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;

    if (userId !== room.roomState.host) return {
        success: false, 
        error: "You are not the host."
    };

    if (room.roomState.status !== ROOM_STATUSES.LOBBY) return { 
        success: false, 
        error: "Game has already started." 
    };

    const player = room.roomState.players.find((player) => player.id === userId);
    if (!player) return {
        success: false, 
        error: "You are not connected to this room."
    };

    // validate roundsToWin is a VALID option
    if (!MATCH_ROUND_OPTIONS.includes(roundsToWin)) return {
        success: false, 
        error: "You did not select a valid round value."
    };

    room.roomState.roundsToWin = roundsToWin;
    saveRoom(normalizedRoomCode, room);

    return { success: true, roomCode: normalizedRoomCode };
}
