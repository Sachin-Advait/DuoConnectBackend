import mongoose from "mongoose";

const PeerSchema = new mongoose.Schema(
  {
    userName: { type: String, default: null },
    image: { type: String, default: null },
    offer: { type: String, default: null }, // Only used for caller
    answer: { type: String, default: null }, // Only used for callee
    candidates: { type: [String], default: [] },
    audio: { type: Boolean, default: false },
    video: { type: Boolean, default: false },
    peerId: { type: String, default: null },
  },
  { _id: false }
);

const RoomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    status: { type: String, default: "waiting" }, // e.g., waiting, connected, ended
    caller: { type: PeerSchema, default: () => ({}) },
    callee: { type: PeerSchema, default: () => ({}) },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", RoomSchema);

export default Room;
