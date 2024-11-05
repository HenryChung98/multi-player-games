"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { io } from "socket.io-client";
import Chat from "@/components/Chat";
import Inputs from "@/components/Inputs";

const socket = io("http://192.168.11.171:3001");

export default function Chatroom() {
  const { user, loading } = useUser();
  const [chat, setChat] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const room = "chatroom";

  // 방 나가기 함수
  const leaveRoom = () => {
    if (user) {
      socket.emit("leave_room", { user: user.nickname, room });
    }
  };

  useEffect(() => {
    if (user) {
      // 방 참가
      socket.emit("join_room", room);
      socket.emit("user_joined", { user: user.nickname, room });

      // 사용자 목록 업데이트 수신
      socket.on("update_user_list", (users) => {
        setOnlineUsers(users);
      });

      // 메시지 수신
      const handleMessage = (msg) => {
        setChat((prev) => [...prev, msg]);
      };

      socket.on("recieve_message", handleMessage);
      return () => {
        leaveRoom();
        socket.off("user_joined_confirmed");
        socket.off("recieve_message");
        socket.off("update_user_list");
      };
    }
  }, [user]);

  if (loading) {
    return <div>loading</div>;
  }

  const UserList = () => (
    <div className="p-4 border-l">
      <h3 className="font-bold mb-2">Online Users ({onlineUsers.length})</h3>
      <ul className="space-y-1">
        {onlineUsers.map((nickname) => (
          <li
            key={nickname}
            className={`${
              nickname === user?.nickname ? "text-blue-500 font-bold" : ""
            }`}
          >
            {nickname}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {user ? (
        <div className="flex min-h-screen">
          <div className="flex-1">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold">Chat Room</h2>
              <Link href="/" className="text-blue-500 hover:underline">
                go back
              </Link>
            </div>
            <div className="flex">
              <div className="flex-1">
                <Chat chat={chat} user={user.nickname} />
                <Inputs
                  setChat={setChat}
                  user={user.nickname}
                  socket={socket}
                  roomName={room}
                />
              </div>
              <UserList />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div>not logged in</div>
          <Link href="/auth/login">Login</Link>
        </>
      )}
    </>
  );
}
