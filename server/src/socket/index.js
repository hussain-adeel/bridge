import { registerGameHandlers } from "./gameHandlers.js";
import { registerRoomHandlers } from "./roomHandlers.js";

export function setupSockets(io) {
    io.on("connection", (socket) => {
        console.log(`[Bridge Server] User connected: ${socket.id}`);

        registerRoomHandlers(io, socket);
        registerGameHandlers(io, socket);

        socket.on("disconnect", () => {
            console.log(`[Bridge Server] User disconnected: ${socket.id}`);
        });
    });
}