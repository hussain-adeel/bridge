const activeRooms = new Map();

export function getRoom(roomCode) {
    return activeRooms.get(roomCode);
}

export function saveRoom(roomCode, roomData) {
    activeRooms.set(roomCode, roomData);
}

export function deleteRoom(roomCode) {
    activeRooms.delete(roomCode);
}

export function getAllRooms() {
    return Array.from(activeRooms.values());
}

export function roomExists(roomCode) {
    return activeRooms.has(roomCode);
}
