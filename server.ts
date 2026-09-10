const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = parseInt(process.env.SOCKET_PORT || '3001', 10);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

const rooms = new Map();

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      interpreters: new Map(),
      clerks: new Map(),
    });
  }
  return rooms.get(roomId);
}

function broadcastUserCount(roomId) {
  const room = getRoom(roomId);
  const count = {
    interpreters: room.interpreters.size,
    clerks: room.clerks.size,
    total: room.interpreters.size + room.clerks.size,
  };
  io.to(roomId).emit('user-count', count);
}

io.on('connection', (socket) => {
  let currentRoom = null;
  let role = null;

  socket.on('join-session', ({ sessionId, userRole }) => {
    currentRoom = sessionId;
    role = userRole;

    socket.join(sessionId);
    const room = getRoom(sessionId);

    if (role === 'interpreter') {
      room.interpreters.set(socket.id, {
        socketId: socket.id,
        connectedAt: Date.now(),
      });
    } else {
      room.clerks.set(socket.id, {
        socketId: socket.id,
        connectedAt: Date.now(),
      });
    }

    socket.emit('session-joined', { sessionId, role });
    broadcastUserCount(sessionId);
  });

  socket.on('leave-session', ({ sessionId }) => {
    handleLeave(socket, sessionId || currentRoom);
  });

  socket.on('sign-data', ({ sessionId, landmarks, label, confidence, timestamp }) => {
    const targetRoom = sessionId || currentRoom;
    if (targetRoom) {
      socket.to(targetRoom).emit('sign-data', {
        socketId: socket.id,
        role,
        landmarks,
        label,
        confidence,
        timestamp,
      });
    }
  });

  socket.on('text-message', ({ sessionId, text, sender }) => {
    const targetRoom = sessionId || currentRoom;
    if (targetRoom) {
      io.to(targetRoom).emit('text-message', {
        socketId: socket.id,
        role,
        text,
        sender: sender || role,
        timestamp: Date.now(),
      });
    }
  });

  socket.on('typing', ({ sessionId, isTyping }) => {
    const targetRoom = sessionId || currentRoom;
    if (targetRoom) {
      socket.to(targetRoom).emit('typing', {
        socketId: socket.id,
        role,
        isTyping,
      });
    }
  });

  socket.on('reaction', ({ sessionId, emoji }) => {
    const targetRoom = sessionId || currentRoom;
    if (targetRoom) {
      io.to(targetRoom).emit('reaction', {
        socketId: socket.id,
        role,
        emoji,
        timestamp: Date.now(),
      });
    }
  });

  socket.on('session-end', ({ sessionId }) => {
    const targetRoom = sessionId || currentRoom;
    if (targetRoom) {
      io.to(targetRoom).emit('session-ended', {
        endedBy: socket.id,
        endedByRole: role,
        timestamp: Date.now(),
      });
    }
  });

  socket.on('disconnect', () => {
    if (currentRoom) {
      handleLeave(socket, currentRoom);
    }
  });

  function handleLeave(sock, roomId) {
    if (!roomId) return;

    sock.leave(roomId);
    const room = getRoom(roomId);

    room.interpreters.delete(sock.id);
    room.clerks.delete(sock.id);

    broadcastUserCount(roomId);

    if (room.interpreters.size === 0 && room.clerks.size === 0) {
      rooms.delete(roomId);
    }

    if (currentRoom === roomId) {
      currentRoom = null;
      role = null;
    }
  }
});

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
