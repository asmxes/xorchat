"use client";
import { useState, useEffect, useRef } from "react";

import { Textarea } from "@/components/ui/textarea";

const commands = ["username", "passkey", "clear", "room", "help"];

export default function Input({ messages, setMessages }) {
  const [username, setUsername] = useState("guest");
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("local");
  const [passkey, setPasskey] = useState();
  const [showCommands, setShowCommands] = useState(false);
  const [animationState, setAnimationState] = useState(3);
  const [filteredCommands, setFilteredCommands] = useState(commands);

  const inputRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      if (message.startsWith("/")) {
        //handlecommand
        setMessage(""); // Clear input after sending
      } else {
        setMessages([...messages, { username: username, text: message }]);
        setMessage(""); // Clear input after sending
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (value.startsWith("/")) {
      setShowCommands(true);

      const searchTerm = value.slice(1).toLowerCase();
      setFilteredCommands(
        commands.filter((cmd) => cmd.toLowerCase().includes(searchTerm)),
      );
    } else {
      setShowCommands(false);
    }
  };

  const handleCommandSelect = (commandName) => {
    setMessage(`/${commandName} `);
    setShowCommands(false);
    inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
      setShowCommands(false);
    } else if (e.key === "Tab" && showCommands && filteredCommands.length > 0) {
      e.preventDefault();
      handleCommandSelect(filteredCommands[0]);
    }
    // handle arrows for commands
  };

  const animationSpec = [
    "animate-blurOut animate-zoomOut",
    "animate-blurIn animate-zoomIn",
    "",
    "invisible pointer-events-none",
  ];

  useEffect(() => {
    if (showCommands) {
      setAnimationState(1); // Trigger "enter" animation
      setTimeout(() => {
        setAnimationState(2); // Stop animation after hiding commands
      }, 200);
    } else if (!showCommands && animationState === 2) {
      setAnimationState(0); // Trigger "exit" animation
      setTimeout(() => {
        setAnimationState(3); // Stop animation after hiding commands
      }, 200);
    }
  }, [showCommands]);

  function CommandList() {
    return (
      <div
        className={`absolute -mt-[8.5rem] ml-1 z-50 h-36 w-full
          flex flex-col justify-end bg-transparent
          ${filteredCommands.length === 0 ? "pointer-events-none" : animationState == 3 ? "pointer-events-none" : ""}
          `}
      >
        <div
          className={`w-full backdrop-blur-lg ${animationSpec[animationState]}`}
        >
          {filteredCommands.map((cmd) => (
            <div
              key={cmd}
              className="cursor-pointer p-1.5 text-gray-400
              transition-color ease-out duration-200
              hover:text-bg hover:bg-primary"
              onClick={() => handleCommandSelect(cmd)}
            >
              /{cmd}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow mt-4">
      <div className="flex mt-2 text-primary w-fit h-fit text-nowrap">
        <div>{username}</div>
        <div>@</div>
        <div>{room}</div>
        <div>:</div>
      </div>
      <div className="relative w-full">
        {<CommandList />}
        <Textarea
          className="resize-none min-h-full w-full"
          value={message}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          ref={inputRef}
          placeholder="Type your message here."
        />
      </div>
    </div>
  );
}
