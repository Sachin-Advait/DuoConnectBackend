import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    offer: {
      type: String,
      default: null,
    },
    candidate: {
      type: String,
      default: null,
    },
    userName: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    audio: {
      type: Boolean,
      default: false,
    },
    video: {
      type: Boolean,
      default: false,
    },
    remotePeerId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", RoomSchema);

export default Room;
