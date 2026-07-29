const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.SOCKET_PORT || 3001;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", methods: ["GET", "POST"] },
});

const waitingDeaf = [];
const sessions = new Map();

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

io.on("connection", (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  socket.on("interpreter:find", ({ userId, language }) => {
    socket.data.userId = userId;
    socket.data.language = language || "en";
    socket.data.role = "deaf";
    waitingDeaf.push(socket.id);
    console.log(`[socket] ${userId} is waiting for interpreter (lang: ${language})`);

    socket.emit("interpreter:waiting", { position: waitingDeaf.length });
    broadcastStatus();
  });

  socket.on("interpreter:available", ({ userId, languages }) => {
    socket.data.userId = userId;
    socket.data.languages = languages || ["en"];
    socket.data.role = "clerk";

    if (waitingDeaf.length > 0) {
      const deafSocketId = waitingDeaf.shift();
      const deafSocket = io.sockets.sockets.get(deafSocketId);
      if (deafSocket) {
        const sessionId = generateId();
        const session = { id: sessionId, deaf: deafSocketId, clerk: socket.id, startTime: Date.now(), status: "active", language: deafSocket.data.language };
        sessions.set(sessionId, session);
        socket.join(sessionId);
        deafSocket.join(sessionId);
        socket.emit("interpreter:matched", { sessionId, role: "clerk", language: deafSocket.data.language });
        deafSocket.emit("interpreter:matched", { sessionId, role: "deaf", language: deafSocket.data.language });
        broadcastStatus();
      } else {
        waitingDeaf.shift();
      }
    } else {
      socket.emit("interpreter:no-match");
    }
  });

  socket.on("interpreter:signal", ({ sessionId, type, data }) => {
    const session = sessions.get(sessionId);
    if (!session) return;
    const target = type === "deaf-to-clerk" ? session.clerk : session.deaf;
    io.to(target).emit("interpreter:signal", { type, data, from: socket.data.role });
  });

  socket.on("interpreter:end", ({ sessionId }) => {
    const session = sessions.get(sessionId);
    if (!session) {
      const idx = waitingDeaf.indexOf(socket.id);
      if (idx >= 0) waitingDeaf.splice(idx, 1);
      broadcastStatus();
      return;
    }
    io.to(sessionId).emit("interpreter:ended", { sessionId, reason: "disconnected" });
    sessions.delete(sessionId);
    broadcastStatus();
  });

  socket.on("interpreter:rate", ({ sessionId, rating }) => {
    const session = sessions.get(sessionId);
    if (session) {
      io.to(session.deaf).emit("interpreter:rated", { sessionId, rating });
      io.to(session.clerk).emit("interpreter:rated", { sessionId, rating });
    }
  });

  socket.on("disconnect", () => {
    const idx = waitingDeaf.indexOf(socket.id);
    if (idx >= 0) waitingDeaf.splice(idx, 1);

    for (const [sessionId, session] of sessions) {
      if (session.deaf === socket.id || session.clerk === socket.id) {
        const otherId = session.deaf === socket.id ? session.clerk : session.deaf;
        io.to(otherId).emit("interpreter:ended", { sessionId, reason: "disconnected" });
        sessions.delete(sessionId);
      }
    }
    broadcastStatus();
  });

  function broadcastStatus() {
    io.emit("interpreter:status", { waiting: waitingDeaf.length, activeSessions: sessions.size });
  }
});

httpServer.listen(PORT, () => {
  console.log(`[socket] interpreter server running on port ${PORT}`);
});
