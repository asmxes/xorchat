"use client";

import { useState } from "react";
import Content from "./[home]/content";
import Input from "./[home]/input";
import Members from "./[home]/members";
import Rooms from "./[home]/rooms";

import { MessageData, ChatInfo } from "./[home]/types";

function QA() {
  <div className=" text-neutral-400 text-xs flex flex-col space-y-4">
    <h1 className="text-neutral-200 font-semibold text-xl">
      Welcome to xor.chat!
    </h1>
    <div className="mt-2">
      Before you begin,
      <div className="mt-2">
        Change your username using{" "}
        <code className="bg-neutral-900 p-1 rounded">
          /username &lt;your username&gt;
        </code>
      </div>
    </div>
    <div className="mt-2">
      You can then join a room with{" "}
      <code className="bg-neutral-900 p-1 rounded">/join &lt;room id&gt;</code>
    </div>
    <div className="mt-2">
      You can crypt your messages using{" "}
      <code className="bg-neutral-900 p-1 rounded">
        /key &lt;your pass key&gt;
      </code>
      <div className="mt-2">
        Make sure other people already know the passkey, otherwise they will not
        be able to read your messages!
      </div>
      <div className="mt-2">Happy chatting! </div>
    </div>
  </div>;
}

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
