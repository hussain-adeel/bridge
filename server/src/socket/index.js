module.exports = (io) => {

    io.on("connection", (socket) => {
        console.log(`[Bridge Server] User connected: ${socket.id}`);
        
        
        socket.on("disconnect", () => {
            console.log(`[Bridge Server] User disconnected: ${socket.id}`);
        });
    });

};