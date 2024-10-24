"use client";
import { useEffect, useRef } from "react";
import { XOR } from "./utility";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

function Message({ key, msg, decryption_key }) {
  let system_message = msg.username === "system";
  return (
    <div
      key={key}
      className={`flex ${system_message ? "justify-center py-1" : "justify-start"} space-x-1 mt-0.5
         animate-blurIn`}
    >
      {!system_message && (
        <div className="flex">
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

export default function Content({ messages, decryption_key }) {
  const bottomRef = useRef(null); // Reference for the bottom of the message list

  useEffect(() => {
    if (bottomRef.current) {
      // Scroll to the bottom of the message list
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className=" flex flex-col justify-end h-full sm:h-96 overflow-auto min-h-40 resize-y">
      <div className="overflow-auto">
        {messages.map((msg, index) => (
          <Message key={index} msg={msg} decryption_key={decryption_key} />
        ))}
        {/* Dummy div at the bottom to scroll into view */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
