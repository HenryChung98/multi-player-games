"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// to get user data
import { useUser } from "@/app/context/UserContext";

// socket
import { io } from "socket.io-client";

// components
import Chat from "@/components/Chat";
import Inputs from "@/components/Inputs";

// const socket = io("http://localhost:3001");
const socket = io("http://192.168.11.171:3001");

export default function DrawingGameRoom() {
  // to get user data
  const { user, loading } = useUser();
  // set message
  const [chat, setChat] = useState([]);
  // set room
  const [room, setRoom] = useState("drawingRoom");

  // handle to join room
  const joinRoom = (roomName) => {
    socket.emit("join_room", roomName);
    setRoom(roomName);
  };
  useEffect(() => {
    if (user) {
      joinRoom("drawingRoom");
    }
  }, [user]);

  // handle for recieved message
  useEffect(() => {
    socket.on("recieve_message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("recieve_message");
    };
  }, []);

  if (loading) {
    return <div>loading</div>;
  }
  return (
    <>
      {user ? (
        <>
          <canvas className="rounded border border-blue-500 w-[500px]"></canvas>
          <Chat chat={chat} user={user.nickname} />
          <Inputs
            setChat={setChat}
            user={user.nickname}
            socket={socket}
            roomName={room}
          />

          <div>{user.nickname}</div>
        </>
      ) : (
        <>
          <div>not logged in</div>
          <Link href="/auth/login">Login</Link>
        </>
      )}
    </>
  );
}
