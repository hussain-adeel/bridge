import { generateRoomCode } from "../utils/helpers.js";

const activeGames = new Map();

export function createRoom({userId, username}) {
    console.log("Creating room...", userId, username);
    const roomCode = generateRoomCode();


    return {success: true, roomId: roomCode};
}

export function joinRoom({userId, username, roomId}) {
    console.log("Joining room...", roomId, username);
    return {success: true, roomId: roomId};
}
