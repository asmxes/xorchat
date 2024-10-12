"use client";
import { useEffect, useRef } from "react";

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

export default function Content({ messages, setMessages }) {
  const bottomRef = useRef(null); // Reference for the bottom of the message list

  const handleClearChat = () => {
    setMessages([]); // Clear all messages
  };

  useEffect(() => {
    if (bottomRef.current) {
      // Scroll to the bottom of the message list
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-2/5 resize-y overflow-auto">
      <ContextMenu>
        <ContextMenuTrigger>
          <ScrollArea className="pr-2 pb-2 h-full">
            {messages.map((msg, index) => (
              <div key={index} className="flex space-x-1">
                <div className="flex">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`h-fit underline underline-offset-2 ${msg.username === "system" ? "text-red-900" : ""}`}
                        >
                          @{msg.username}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>10/05/2024 @ 10:26 GMT + 1:00</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div
                    className={`${msg.username === "system" ? "text-red-900" : ""}`}
                  >
                    :
                  </div>
                </div>
                <div
                  className={`${msg.username === "system" ? "text-neutral-600" : "text-neutral-400"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Dummy div at the bottom to scroll into view */}
            <div ref={bottomRef} />
          </ScrollArea>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-fit">
          <ContextMenuItem onClick={handleClearChat}>
            Clear chat
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
