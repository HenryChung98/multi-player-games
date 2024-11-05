"use client";
import React from "react";

export default function Chat({ chat, user }) {
  return (
    <>
      <div className={`border-slate-500 bg-white`}>
        {chat.map((message, index) => {
          message = { ...message, own: message.user === user };
          return <Message key={index} {...message} />;
        })}
      </div>
    </>
  );
}

const chunkText = (text, chunkSize) => {
  const regex = new RegExp(`.{1,${chunkSize}}`, "g");
  return text.match(regex) || [];
};

const Message = ({ content, own, user, type }) => {
  if (type === "server") {
    return <p className="text-center text-sm text-gray-500 my-2">{content}</p>;
  }

  const chunks = chunkText(content, 20);

  return (
    <>
      <p className={`px-3 py-1 flex ${own ? "justify-end" : "justify-start"}`}>
        {!own && (
          <span className="text-blue-700 bg-blue-300 w-[35px] h-[35px] mr-3 flex justify-center items-center rounded">
            {user.charAt(0).toUpperCase()}
          </span>
        )}
        <span
          className={`rounded text-xl p-2 max-w-xs ${
            own ? "bg-sky-400" : "bg-slate-300"
          }`}
        >
          {chunks.map((chunk, index) => (
            <React.Fragment key={index}>
              {chunk}
              {index < chunks.length - 1 && <br />}{" "}
              {/* Add a line break except for the last chunk */}
            </React.Fragment>
          ))}
        </span>
      </p>
    </>
  );
};
