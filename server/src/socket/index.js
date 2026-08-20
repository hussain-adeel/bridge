import { disconnectPlayer } from "../services/roomService.js";
import { registerGameHandlers } from "./gameHandlers.js";
import { registerRoomHandlers } from "./roomHandlers.js";
import { emitRoomStateUpdated } from "./roomStateEmitter.js";

export function setupSockets(io) {
    io.on("connection", (socket) => {
        console.log(`[Bridge Server] User connected: ${socket.id}`);

        registerRoomHandlers(io, socket);
        registerGameHandlers(io, socket);

        socket.on("disconnect", () => {
            console.log(`[Bridge Server] User disconnected: ${socket.id}`);
            
            const response = disconnectPlayer({ socketId: socket.id })

            if (response.success) emitRoomStateUpdated (io, response?.roomCode);
        });
    });
}