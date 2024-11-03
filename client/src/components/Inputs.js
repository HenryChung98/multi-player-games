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
      <div>
        <input
          className="text-black"
          type="text"
          placeholder="enter your message"
          value={input}
          onChange={(e) => userTyping(e)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  );
}
