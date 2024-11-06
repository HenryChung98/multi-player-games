"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { io } from "socket.io-client";
import Chat from "@/components/Chat";
import Inputs from "@/components/Inputs";
import UserList from "@/components/UserList";

const socket = io("http://192.168.11.171:3001");

export default function DrawingRoom() {
  const { user, loading } = useUser();
  const [chat, setChat] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [displayOnlineUserBar, setDisplayOnlineUserBar] = useState(false);
  const room = "drawingRoom";

  useEffect(() => {
    if (user) {
      // join room
      socket.emit("join_room", room);
      socket.emit("user_joined", { user: user.nickname, room });

      // update user list
      socket.on("update_user_list", (users) => {
        setOnlineUsers(users);
      });

      // handle recieved message
      const handleMessage = (msg) => {
        setChat((prev) => [...prev, msg]);
      };

      socket.on("recieve_message", handleMessage);
      return () => {
        // leave room
        socket.emit("leave_room", { user: user.nickname, room });
        // clean
        socket.off("user_joined_confirmed");
        socket.off("recieve_message");
        socket.off("update_user_list");
      };
    }
  }, [user]);

  if (loading) {
    return <div>loading</div>;
  }

  const handleDisplayOnlineUserBar = () => {
    setDisplayOnlineUserBar(!displayOnlineUserBar);
  };

  return (
    <>
      {user ? (
        <div className="flex min-h-screen">
          <div className="flex-1">
            <div className="flex justify-between items-center p-4">
              <h2 className="font-bold">
                {room} ({onlineUsers.length})
              </h2>

              <button
                className="rounded text-2xl p-2 md:hidden"
                onClick={handleDisplayOnlineUserBar}
              >
                ☰
              </button>
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
              <UserList
                user={user}
                onlineUsers={onlineUsers}
                displayOnlineUserBar={displayOnlineUserBar}
              />
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
