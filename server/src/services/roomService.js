import { generateRoomCode } from "../utils/helpers.js";
import { saveRoom, getAllRooms, deleteRoom } from "../game/state.js";
import { createInitialGameState } from "../game/engine.js";
import { DEFAULT_ROUNDS_TO_WIN, MAX_PLAYERS, ROOM_STATUSES, TEAM_IDS, MATCH_ROUND_OPTIONS, GAME_PHASES, DEAL_NUMBERS, GAME_LOG_EVENTS } from "../../../shared/gameConstants.js";
import { getPlayerGameState, dealCurrentPacket } from "./gameService.js";
import { getValidRoom } from "../utils/roomUtils.js";

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
    if (room.roomState.status !== ROOM_STATUSES.LOBBY) return {success: false, error: "Game has already started."};

    const player = room.roomState.players.find((player) => player.id === userId);

    if (player) {
        player.socketId = socketId;
        player.isConnected = true;
        saveRoom(normalizedRoomCode, room);
        return {success: true, roomCode: normalizedRoomCode};
    }

    const usedIndexes = new Set(
        room.roomState.players.map((player) => player.index)
    );

    const newIndex = Array.from(
        { length: MAX_PLAYERS },
        (_, index) => index
    ).find((index) => !usedIndexes.has(index));

    if (newIndex === undefined) {
        return { success: false, error: "Room is full." };
    }
    
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
    const room = getAllRooms().find((room) => 
        room.roomState.players.some((player) => player.socketId === socketId)
    );

    if (!room) return { success: false };

    const player = room.roomState.players.find((player) => 
        player.socketId === socketId
    );

    const isHost = room.roomState.host === player.id;

    if (room.roomState.status === ROOM_STATUSES.LOBBY) {

        room.roomState.players = room.roomState.players.filter(
            (player) => player.socketId !== socketId
        );

        if (room.roomState.players.length === 0) {
            deleteRoom(room.roomState.roomCode);
            return {
                success: true,
                roomCode: room.roomState.roomCode,
            };
        }

        if (isHost) {
            room.roomState.host = room.roomState.players[0].id;
        }

        saveRoom(room.roomState.roomCode, room);

        return {
            success: true,
            roomCode: room.roomState.roomCode,
        };
    }

    player.isConnected = false;

    // not strictly necessary but just to be consistent
    saveRoom(room.roomState.roomCode, room);

    return {
        success: true,
        roomCode: room.roomState.roomCode,
    };

}

export function reconnectPlayer({ userId, roomCode, socketId }) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;

    const player = room.roomState.players.find((player) => 
        player.id === userId
    );

    if (!player) return { success: false, error: "You are not in this room." };

    player.socketId = socketId;
    player.isConnected = true;
    
    // not strictly necessary but just to be consistent
    saveRoom(normalizedRoomCode, room);

    return { success: true, roomCode: normalizedRoomCode };
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

    return { 
        success: true, 
        roomCode: normalizedRoomCode 
    };

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

    const normalizedRoundsToWin = Number(roundsToWin);

    if (
    !Number.isInteger(normalizedRoundsToWin) ||
    !MATCH_ROUND_OPTIONS.includes(normalizedRoundsToWin)
    ) {
    return {
        success: false,
        error: "You did not select a valid round value."
    };
    }

    room.roomState.roundsToWin = normalizedRoundsToWin;
    saveRoom(normalizedRoomCode, room);

    return { 
        success: true, 
        roomCode: normalizedRoomCode 
    };
}

export function startMatch({userId, roomCode}) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;

    const player = room.roomState.players.find((player) => player.id === userId);
    if (!player) return {
        success: false, 
        error: "You are not connected to this room."
    };

    if (userId !== room.roomState.host) return {
        success: false, 
        error: "You are not the host."
    };

    if (room.roomState.status !== ROOM_STATUSES.LOBBY) return { 
        success: false, 
        error: "Game has already started." 
    };

    if (room.roomState.players.length !== MAX_PLAYERS) return { 
        success: false, 
        error: `You need exactly ${MAX_PLAYERS} players to start.` 
    };

    const allPlayersConnected = room.roomState.players.every((player) => 
        player.isConnected === true
    );

    if (!allPlayersConnected) return {
        success: false,
        error: "Not all players are connected."
    }

    const allPlayersReady = room.roomState.players.every((player) => 
        player.isReady === true
    );

    if (!allPlayersReady) return {
        success: false,
        error: "Not all players are ready"
    };

    // inital game set up logic
    // set to deal number 1
    room.roomState.status = ROOM_STATUSES.IN_PROGRESS;
    room.gameState = createInitialGameState();
    room.gameState.gamePhase = GAME_PHASES.DEALING;
    room.gameState.dealNumber = DEAL_NUMBERS.FIRST;

    const dealResult = dealCurrentPacket(
        room.gameState,
        room.roomState.players
    );

    if (!dealResult.success) return dealResult;

    room.gameState.gameLog.push(
        {
            id: crypto.randomUUID(),
            type: GAME_LOG_EVENTS.MATCH_STARTED,
        },
        {
            id: crypto.randomUUID(),
            type: GAME_LOG_EVENTS.ROUND_STARTED,
            roundNumber: room.gameState.roundNumber,
        }
    );

    saveRoom(normalizedRoomCode, room);

    return { success: true, roomCode: normalizedRoomCode }
}

export function leaveRoom({ userId, roomCode }) {
    const roomResult = getValidRoom(roomCode);
    if (!roomResult.success) return roomResult;

    const { roomCode: normalizedRoomCode, room } = roomResult;
    const player = room.roomState.players.find((player) => player.id === userId);

    if (!player) return {
        success: false, 
        error: "You are not connected to this room."
    };

    const isHost = room.roomState.host === userId;

    if (room.roomState.status === ROOM_STATUSES.LOBBY) {

        room.roomState.players = room.roomState.players.filter(
            (player) => player.id !== userId
        );

        if (room.roomState.players.length === 0) {
            deleteRoom(room.roomState.roomCode);
            return {
                success: true,
                roomCode: normalizedRoomCode,
            };
        }

        if (isHost) {
            room.roomState.host = room.roomState.players[0].id;
        }

        saveRoom(room.roomState.roomCode, room);

        return {
            success: true,
            roomCode: normalizedRoomCode,
        };
    }

    return {
        success: false,
        error: "Cannot leave ongoing game.",
    };
}
