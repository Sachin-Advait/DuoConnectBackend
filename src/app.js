import express from "express";
import connectMongoDb from "./connection.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import roomService from "./services/roomSerxice.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  },
});

// Pass `io` to RoomService
roomService.initialize(io);

// Connect DB
connectMongoDb();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Attach socket handler
socketHandler(io);

// Start server
const hostUrl = "0.0.0.0";
server.listen(process.env.PORT, hostUrl, () => {
  console.log(`Server running on http://${hostUrl}:${process.env.PORT}`);
});
