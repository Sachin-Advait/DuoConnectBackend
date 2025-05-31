import roomService from "../services/roomSerxice.js";
import { saveMessage, getMessages } from "../services/chatService.js";

export default function socketHandler(io) {
  roomService.initialize(io);

  io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    socket.on("callerCandidate", async (data) => {
      await roomService.setCallerCandidates(data.roomId, data);
    });

    socket.on("createRoom", async (data) => {
      socket.roomId = data.roomId;
      await roomService.createRoom(data.roomId, socket, data);
    });

    socket.on("joinRoom", async (data) => {
      socket.roomId = data.roomId;
      await roomService.joinRoom(data.roomId, socket);
    });

    socket.on("answer", async (data) => {
      await roomService.forwardSignaling(data.roomId, socket, data);
    });

    socket.on("calleeCandidate", async (data) => {
      await roomService.forwardSignaling(data.roomId, socket, data);
    });

    socket.on("removeRoom", async (roomId) => {
      await roomService.removeRoom(roomId, socket);
    });

    socket.on("screenShare", async (data) => {
      await roomService.handleScreenShare(data.roomId, socket, data);
    });

    socket.on("mediaToggle", async (data) => {
      const { roomId } = data;
      await roomService.handleToggleMedia(roomId, socket, data);
    });

    /// Chat Message

    // Receive and save incoming messages
    socket.on("chatMessage", async (data) => {
      const { roomId, username, message } = data;
      const saved = await saveMessage(roomId, username, message);
      socket.to(roomId).emit("chatMessage", saved);
    });

    // Send chat history when a user joins
    socket.on("getChatHistory", async (roomId) => {
      const messages = await getMessages(roomId);
      socket.emit("chatHistory", messages);
    });

    // Disconnect the video call
    socket.on("disconnect", async () => {
      if (socket.roomId) {
        await roomService.removeRoom(socket.roomId, socket);
      }
      console.log("Socket disconnected:", socket.id);
    });
  });
}
