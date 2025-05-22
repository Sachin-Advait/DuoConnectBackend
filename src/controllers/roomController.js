import Room from "../models/roomModel.js";

// Save or update RoomData
export async function saveOrUpdateRoomData(roomData) {
  try {
    const updatedRoom = await Room.findOneAndUpdate(
      { roomId: roomData.roomId },
      {
        $set: {
          offer: roomData.offer,
          candidate: roomData.candidate,
          userName: roomData.userName,
          image: roomData.image,
          audio: roomData.audio ?? false,
          video: roomData.video ?? false,
          remotePeerId: roomData.remotePeerId,
        },
      },
      { upsert: true, new: true }
    );
    return updatedRoom;
  } catch (err) {
    console.error("Error saving or updating RoomData:", err);
    throw err;
  }
}

// Get RoomData by roomId
export async function getRoomData(roomId) {
  try {
    return await Room.findOne({ roomId });
  } catch (err) {
    console.error("Error fetching RoomData:", err);
    throw err;
  }
}

// Delete RoomData by roomId
export async function deleteRoomData(roomId) {
  try {
    await Room.deleteOne({ roomId });
  } catch (err) {
    console.error("Error deleting RoomData:", err);
    throw err;
  }
}
