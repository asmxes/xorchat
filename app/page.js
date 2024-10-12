"use client";

import { useState } from "react";
import Content from "./[home]/content";
import Input from "./[home]/input";

export default function Home() {
  const [messages, setMessages] = useState([]);

  return (
    <div className="flex flex-col w-5/12 h-screen py-10">
      <Content messages={messages} setMessages={setMessages} />
      <Input messages={messages} setMessages={setMessages} />
    </div>
  );
}
