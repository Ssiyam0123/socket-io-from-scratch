"use client";

import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export default function App() {
  const [socketId, setSocketId] = useState("");
  const [friendId, setFriendId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const socket = useMemo(() => io("http://localhost:4000"), []);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected:", socket.id);
    });

    socket.on("receive-message", (msg) => {
      console.log("received:", msg);
      setMessages((prev) => [...prev, `Friend: ${msg}`]);
    });

    return () => socket.disconnect();
  }, [socket]);

  const joinPrivate = (e) => {
    e.preventDefault();
    socket.emit("join-private", {
      userId: socketId,
      otherUserId: friendId,
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const roomName = [socketId, friendId].sort().join("_");

    socket.emit("private-message", {
      roomName,
      message,
    });

    setMessages((prev) => [...prev, `You: ${message}`]);
    setMessage("");
  };

  return (
    <div>
      <h3>Your ID: {socketId}</h3>

      <form onSubmit={joinPrivate}>
        <input
          placeholder="Paste Friend Socket ID"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
        />
        <button>Join Private Chat</button>
      </form>

      <form onSubmit={sendMessage}>
        <input
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>Send</button>
      </form>

      {messages.map((m, i) => (
        <p key={i}>{m}</p>
      ))}
    </div>
  );
}
