const activeRooms = new Map();

export function getRoom(roomId) {
    return activeRooms.get(roomId);
}

export function saveRoom(roomId, roomData) {
    activeRooms.set(roomId, roomData);
}

export function deleteRoom(roomId) {
    activeRooms.delete(roomId);
}

export function getAllRooms() {
    return Array.from(activeRooms.values());
}

export function roomExists(roomId) {
    return activeRooms.has(roomId);
}