"use client";
import { useEffect, useRef } from "react";
import { XOR } from "./utility";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

function QA() {
  return (
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
        <code className="bg-neutral-900 p-1 rounded">
          /join &lt;room id&gt;
        </code>
      </div>
      <div className="mt-2">
        You can crypt your messages using{" "}
        <code className="bg-neutral-900 p-1 rounded">
          /key &lt;your pass key&gt;
        </code>
        <div className="mt-2">
          Make sure other people already know the passkey, otherwise they will
          not be able to read your messages!
        </div>
        <div className="mt-2">Happy chatting! </div>
      </div>
    </div>
  );
}

function Message({ key, msg, decryption_key }) {
  let system_message = msg.username === "system";
  return (
    <div
      key={key}
      className={`flex ${system_message ? "justify-center py-1" : "justify-start"} space-x-1 mt-0.5
         animate-blurIn bg-transparent`}
    >
      {!system_message && (
        <div className="flex bg-transparent">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`h-fit underline underline-offset-2`}>
                  @{msg.username}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{msg.time}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div>:</div>
        </div>
      )}

      <div
        className={`${msg.username === "system" ? "text-neutral-600" : "text-neutral-400"}`}
      >
        {msg.username === "system" ? msg.text : XOR(msg.text, decryption_key)}
      </div>
    </div>
  );
}

export default function Content({ messages, decryption_key, selectedRoom }) {
  const bottomRef = useRef(null); // Reference for the bottom of the message list

  useEffect(() => {
    if (bottomRef.current) {
      // Scroll to the bottom of the message list
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className=" flex flex-col justify-end h-full sm:h-96 overflow-auto min-h-40 resize-y bg-transparent">
      <div className="overflow-auto bg-transparent">
        {selectedRoom === "local" ? <QA /> : null}
        {messages.map((msg, index) => (
          <Message key={index} msg={msg} decryption_key={decryption_key} />
        ))}
        {/* Dummy div at the bottom to scroll into view */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
