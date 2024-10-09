"use client";
import { useState, useRef, useEffect    } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollAreaRef = useRef(null)

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { username: "asm", text: message }]);
      setMessage(""); // Pulisce l'input dopo l'invio
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleClearChat = () => {
    setMessages([]); // Clear all the messages
  };

  return (
  <div className="w-2/6 flex flex-col mt-10">
    {/* Sezione scrollabile per i messaggi */}
    <ContextMenu>
      <ContextMenuTrigger >
        <ScrollArea className="w-full h-[40rem] pr-4" ref={scrollAreaRef}>
          {messages.map((msg, index) => (
            <div key={index} className="flex space-x-2">
              <div className="flex">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <div className="h-fit underline underline-offset-4">@{msg.username}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>10/05/2024 @ 10:26 GMT + 1:00</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div>:</div>
              </div>
              <div className="text-neutral-400">{msg.text}</div>
            </div>
          ))}
        </ScrollArea>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-fit">
        <ContextMenuItem onClick={handleClearChat}>
          Clear chat
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
    {/* Input e pulsante per inviare i messaggi */}
    <div className="flex w-full mt-4 space-x-2">
      {/* <Input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Scrivi un messaggio..." /> */}
      <div className="-ml-[5.5rem] mt-2 text-[#00FF41] w-fit h-fit text-nowrap">asm@A9B0-00B0:</div>
      <Textarea value={message}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();  // Previene l'andata a capo
          handleSendMessage();  // Invia il messaggio
        }
      }}
      onChange={(e) => setMessage(e.target.value)} 
      placeholder="Type your message here." />
      {/* <button
        onClick={handleSendMessage}
        className="ml-2 p-2 bg-blue-500 text-white"
      >
        Invia
      </button> */}
    </div>
  </div>
);

}
