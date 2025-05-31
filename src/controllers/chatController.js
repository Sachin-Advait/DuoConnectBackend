import ChatMessage from "../models/ChatMessage.js";

export async function saveMessage(
  roomId,
  username,
  message,
  timestamp = new Date()
) {
  const newMsg = new ChatMessage({ roomId, username, message, timestamp });
  return await newMsg.save();
}

export async function getMessages(roomId) {
  return await ChatMessage.find({ roomId }).sort({ timestamp: 1 });
}
