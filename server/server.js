const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const port = 3001;

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);

    socket.to(room).emit("user_joined", {
      message: `User ${socket.id} has joined the room.`,
    });
  });

  socket.on("send_message", ({ room, msg }) => {
    socket.to(room).emit("recieve_message", msg);
  });

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
