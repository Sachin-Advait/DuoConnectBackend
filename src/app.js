import express from "express";
import connectMongoDb from "./connection.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connection
connectMongoDb();

// Middleware - plugin
app.use(express.json());
app.use(cookieParser());

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("offer", (data) => {
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.broadcast.emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
