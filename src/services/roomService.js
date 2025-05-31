class RoomService {
  constructor() {
    // Map format: { roomId: { caller: { id: socket...other value }, callee: { id: socket } } }
    this.roomSockets = new Map();
    this.io = null;
  }

  initialize(ioInstance) {
    this.io = ioInstance;
  }

  async setCallerCandidates(roomId, payload) {
    const existing = this.roomSockets.get(roomId) || {
      caller: {},
      callee: null,
    };

    existing.caller = {
      ...existing.caller,
      callerCandidate: payload,
    };

    this.roomSockets.set(roomId, existing);
    console.log(`Ice Candidate-->> ${JSON.stringify(payload)}`);
  }

  async createRoom(roomId, socket, payload) {
    const existing = this.roomSockets.get(roomId) || {
      caller: {},
      callee: null,
    };

    existing.caller = {
      id: socket.id,
      username: payload.username,
      sdp: payload.sdp,
      image: payload?.image || null,
      audio: payload?.audio ?? true,
      video: payload?.video ?? true,
      screenShare: {
        isSharing: false,
        sdp: null,
      },
      callerCandidate: existing.caller?.callerCandidate,
    };

    this.roomSockets.set(roomId, existing);

    console.log(`Room ${roomId} created.`);
    socket.emit("roomCreated", { roomId });
  }

  async joinRoom(roomId, socket) {
    const room = this.roomSockets.get(roomId);
    if (!room) {
      return socket.emit("joinedRoom", {
        success: false,
        message: "Room not found",
      });
    }

    if (room.callee) {
      return socket.emit("joinedRoom", {
        success: false,
        message: "Room is full",
      });
    }

    room.callee = { id: socket.id };
    this.roomSockets.set(roomId, room);

    io.to(room.caller.id).emit("userJoined", { roomId });

    socket.emit("joinedRoom", { success: true, caller: room.caller });
  }

  async forwardSignaling(roomId, socket, data) {
    const room = this.roomSockets.get(roomId);
    if (!room) return;

    const target =
      room.caller?.id === socket.id ? room.callee?.id : room.caller?.id;

    if (target) {
      target.emit(data.type, data);
    }
  }

  async handleToggleMedia(roomId, socket, data) {
    const room = this.roomSockets.get(roomId);

    const { mediaType, action, firstPeer } = data;

    // Update media status if 'firstPeer' is true
    if (firstPeer) {
      if (mediaType === "audio") {
        room.caller.audio = action;
      } else if (mediaType === "video") {
        room.caller.video = action;
      }
    }

    // Find the peer
    const targetSocketId =
      room.caller?.id === socket.id ? room.callee?.id : room.caller?.id;

    if (!targetSocketId) {
      socket.emit("error", { message: "Peer not connected or unavailable" });
      return;
    }

    // Emit media toggle to the peer
    io.to(targetSocketId).emit("mediaToggle", {
      mediaType,
      action,
    });
  }

  async handleScreenShare(roomId, socket, data) {
    const room = this.roomSockets.get(roomId);

    const isCaller = room.caller?.id === socket.id;
    const currentUser = isCaller ? room.caller : room.callee;
    const targetUser = isCaller ? room.callee : room.caller;

    // Store screen sharing status and SDP
    if (currentUser) {
      currentUser.screenShare = {
        isSharing: data.action === "start",
        sdp: data.sdp || null,
      };
    }

    // Notify the other peer if available
    if (targetUser?.id) {
      targetUser.id.emit("screenShare", data);
    }
  }

  async removeRoom(roomId, socket) {
    const room = this.roomSockets.get(roomId);
    if (!room) return;

    const peer =
      room.caller?.id === socket.id ? room.callee?.id : room.caller?.id;

    this.roomSockets.delete(roomId);

    if (peer?.connected) {
      peer.emit("roomRemoved", { roomId });
    }

    console.log(`Room ${roomId} removed.`);
  }
}

export default new RoomService();
