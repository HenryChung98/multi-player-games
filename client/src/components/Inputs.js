"use client";
import { useState } from "react";

export default function Inputs({ user, socket, setChat, roomName }) {
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input) {
      const msg = {
        room: roomName,
        content: input,
        type: "text",
        user: user,
      };
      socket.emit("send_message", { room: roomName, msg });
      setChat((prev) => [...prev, msg]);
      setInput("");
    }
  };

  const userTyping = (e) => {
    setInput(e.target.value);
  };

  return (
    <>
      <div className="rounded bg-[#09133b] py-5 pl-3">
        <div className="flex w-full">
          <input
            className="text-black flex-grow rounded p-1"
            type="text"
            placeholder="Enter your message"
            value={input}
            onChange={(e) => userTyping(e)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="w-1/13 min-w-[60px] rounded bg-blue-500 p-2 mx-3 hover:bg-blue-300"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
