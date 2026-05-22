const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// This opens the WebSocket channel
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // This is your Vite React app's URL
    methods: ["GET", "POST"]
  }
});

// The port we will run on
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ Backend game server is running on port ${PORT}`);
});