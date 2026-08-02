require("dotenv").config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const setupSockets = require("./socket/index");
setupSockets(io);

app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Bridge Server is running" });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[Bridge Server] Running on port ${PORT}`);
});