"use client";

import { useState } from "react";
import Content from "./[home]/content";
import Input from "./[home]/input";

export default function Home() {
  const [messages, setMessages] = useState([]);
  return (
    <div className="flex flex-col min-h-dvh max-h-dvh w-full px-4 sm:px-0 sm:w-3/4 lg:w-4/6 xl:w-5/12 py-2 sm:py-10">
      <Content messages={messages} setMessages={setMessages} />
      <Input messages={messages} setMessages={setMessages} />
    </div>
  );
}
