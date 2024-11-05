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

// 방별 사용자 관리를 위한 Map
const rooms = new Map();

io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);

    // 해당 방이 없으면 새로 생성
    if (!rooms.has(room)) {
      rooms.set(room, new Set());
    }

    socket.on("user_joined", (data) => {
      if (room) {
        // 사용자를 방 목록에 추가
        const roomUsers = rooms.get(room);
        roomUsers.add(data.user);

        // 소켓에 사용자 정보 저장
        socket.userData = { user: data.user, room };

        // 업데이트된 사용자 목록 전송
        io.to(room).emit("update_user_list", Array.from(roomUsers));
      }
    });
  });

  socket.on("send_message", ({ room, msg }) => {
    socket.to(room).emit("recieve_message", msg);
  });

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  // 명시적인 방 나가기 처리
  socket.on("leave_room", (data) => {
    handleUserLeave(socket, data);
    socket.leave(data.room);
  });

  // 연결 끊김 처리
  socket.on("disconnect", () => {
    if (socket.userData) {
      handleUserLeave(socket, socket.userData);
    }
  });
});

function handleUserLeave(socket, data) {
  const { user, room } = data;
  const roomUsers = rooms.get(room);

  if (roomUsers) {
    // 사용자를 목록에서 제거
    roomUsers.delete(user);

    // 남은 사용자들에게 업데이트된 목록 전송
    io.to(room).emit("update_user_list", Array.from(roomUsers));

    // 방에 아무도 없으면 방 삭제
    if (roomUsers.size === 0) {
      rooms.delete(room);
    }

    console.log(`${user} left ${room}`);
    console.log(`Current users in ${room}:`, Array.from(roomUsers));
  }
}

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
