import Room from "../models/roomModel.js";

// Save or update RoomData for caller or callee
export async function saveOrUpdateRoomData({ roomId, role, data }) {
  try {
    const updateField = role === "caller" ? "caller" : "callee";

    const updatePayload = {};
    Object.entries(data).forEach(([key, value]) => {
      updatePayload[`${updateField}.${key}`] = value;
    });

    const updatedRoom = await Room.findOneAndUpdate(
      { roomId },
      { $set: updatePayload },
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
