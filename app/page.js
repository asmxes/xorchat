"use client";

import { useState } from "react";
import Content from "./[home]/content";
import Input from "./[home]/input";
import Members from "./[home]/members";
import Rooms from "./[home]/rooms";

import { MessageData, ChatInfo } from "./[home]/types";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [chatInfos, setChatInfos] = useState([]);

  return (
    <div className="flex flex-row justify-center w-full ">
      <Rooms chatInfos={chatInfos} />

      <div className=" flex flex-col min-h-dvh max-h-dvh w-full px-4 sm:px-0 sm:w-3/4 lg:w-4/6 xl:w-5/12 py-4 ">
        <div className="w-full items-center flex flex-col justify-center text-primary font-bold pb-4">
          x.c
        </div>

        <Content messages={messages} />
        <Input setMessages={setMessages} setMembers={setMembers} />
      </div>
      <Members members={members} />
    </div>
  );
}
