"use client";

import { useState } from "react";
import Content from "./[home]/content";
import Input from "./[home]/input";
import Members from "./[home]/members";
import Rooms from "./[home]/rooms";

import { MessageData, ChatInfo } from "./[home]/types";

export default function Home() {
  const [chatInfos, setChatInfos] = useState([
    {
      room: "local",
      members: [],
      messages: [],
      key: "",
    },
  ]);
  const [selectedRoom, setSelectedRoom] = useState("local"); // Default to 'local'

  return (
    <div className="flex flex-row justify-center w-full ">
      <Rooms
        chatInfos={chatInfos}
        setChatInfos={setChatInfos}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
      />

      <div className=" flex flex-col min-h-dvh max-h-dvh w-full px-4 sm:px-0 sm:w-3/4 lg:w-4/6 xl:w-5/12 py-4 ">
        <div className="w-full items-center flex flex-col justify-center text-primary font-bold pb-4">
          x.c
        </div>
        <Content
          messages={
            chatInfos.find((info) => info.room === selectedRoom)?.messages || []
          }
          decryption_key={
            chatInfos.find((info) => info.room === selectedRoom)?.key || null
          }
          selectedRoom={selectedRoom}
        />
        <Input
          chatInfos={chatInfos}
          setChatInfos={setChatInfos}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
        />
      </div>
      <Members
        members={
          chatInfos.find((info) => info.room === selectedRoom)?.members || []
        }
      />
    </div>
  );
}
