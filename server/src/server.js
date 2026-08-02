import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import setupSockets from "./socket/index.js";

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

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

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) return next(new Error("[Bridge Auth] No token provided"));

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return next(new Error("[Bridge Auth] Invalid token"));

  socket.user = user;
  next();
});

setupSockets(io);

app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Bridge Server is running" });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[Bridge Server] Running on port ${PORT}`);
});