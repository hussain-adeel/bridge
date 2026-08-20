import { getRoom, roomExists } from "../game/state.js";

export function getValidRoom(roomCode) {
    const normalizedRoomCode = roomCode?.trim().toUpperCase();

    if (!normalizedRoomCode || !roomExists(normalizedRoomCode)) return { success: false, error: "Room does not exist" };

    return {
        success: true,
        roomCode: normalizedRoomCode,
        room: getRoom(normalizedRoomCode)
    };
}