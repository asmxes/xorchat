"use client";
import { useState, useEffect, useRef } from "react";
import { getCurrentTimeUTC, XOR } from "./utility";
import WebSocketClient from "./client"; // Import WebSocket functions and types
import { ServerCMD, ClientCMD, ClientPayload } from "../types"; // Import the types for client commands

const commands = ["username", "key", "clear", "join", "leave", "switch"];

export default function Input({
  chatInfos,
  setChatInfos,
  selectedRoom,
  setSelectedRoom,
}) {
  const [username, setUsername] = useState("guest");
  const [message, setMessage] = useState("");

  const [showCommands, setShowCommands] = useState(false);
  const [animationState, setAnimationState] = useState(3);
  const [filteredCommands, setFilteredCommands] = useState(commands);

  const inputRef = useRef(null);

  const [client, setClient] = useState(null);

  // Create a ref to store the latest value of selectedRoom
  const selectedRoomRef = useRef(selectedRoom);

  const playSound = () => {
    console.log("playing sound");
    const audio = new Audio("../audios/fart.mp3"); // Use a relative path or URL to the sound file
    audio.play();
  };

  // Update the ref whenever selectedRoom changes
  useEffect(() => {
    selectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);

  const cacheMessageInRoom = (room, message) => {
    // Use the ref's current value
    const room_var = room || selectedRoomRef.current;
    setChatInfos((prevChatInfos) =>
      prevChatInfos.map((info) =>
        info.room === room_var
          ? {
              ...info,
              messages: [...info.messages, message], // Add the new message to the room's messages
            }
          : info,
      ),
    );
  };

  const serverCallback = (payload) => {
    const current_time = getCurrentTimeUTC();

    switch (payload.cmd) {
      case ServerCMD.USERNAME_CHANGED:
        setUsername(payload.data.username);
        break;

      case ServerCMD.ROOM_JOINED:
        setSelectedRoom(payload.data.room); // Set new room
        let newChatInfo = {
          room: payload.data.room,
          members: [],
          messages: [],
          key: "",
        };

        setChatInfos((prev) =>
          prev.includes(payload.data.room) ? prev : [...prev, newChatInfo],
        );
        break;

      case ServerCMD.ROOM_LEFT:
        setChatInfos((prev) =>
          prev.filter((chatInfo) => chatInfo.room !== payload.data.room),
        );
        setSelectedRoom("local"); // Set new room
        break;

      case ServerCMD.INFO:
        cacheMessageInRoom(payload.data.room, {
          username: "system",
          text: payload.data.message,
          time: current_time,
        });
        break;

      case ServerCMD.MESSAGE:
        cacheMessageInRoom(payload.data.room, {
          username: payload.data.username,
          text: payload.data.message,
          time: current_time,
        });

        console.log("messageissss:");
        console.log(payload.data.message);
        console.log("usernameis:");
        console.log(`@${username}`);

        if (payload.data.message.includes(`@guest`)) playSound();

        break;

      case ServerCMD.ERROR:
        cacheMessageInRoom(payload.data.room, {
          username: "system",
          text: `Error: ${payload.data.message}`,
          time: current_time,
        });
        break;

      case ServerCMD.MEMBERS:
        setChatInfos((prevChatInfos) =>
          prevChatInfos.map((info) =>
            info.room === payload.data.room
              ? {
                  ...info,
                  members: payload.data.members,
                }
              : info,
          ),
        );
        console.log(payload.data.members);
        break;

      default:
        console.log("Unknown payload command", payload.cmd);
    }
  };

  const handleCommand = (commandMessage) => {
    const [command, ...contentArr] = commandMessage.split(" "); // Split by space
    const content = contentArr.join(" ").trim(); // Get the content after the command name
    const current_time = getCurrentTimeUTC();

    const check_content = () => {
      if (!content) {
        setChatInfos((prev) =>
          prev.map((info) =>
            info.room === selectedRoom
              ? {
                  ...info,
                  messages: [
                    ...info.messages,
                    {
                      username: "system",
                      text: `The command '${command}' requires an argument.`,
                      time: getCurrentTimeUTC(),
                    },
                  ],
                }
              : info,
          ),
        );
        return false;
      }
      return true;
    };

    // Handle different commands
    switch (command) {
      case "/key":
        setChatInfos((prevChatInfos) =>
          prevChatInfos.map((info) =>
            info.room === selectedRoom
              ? {
                  ...info,
                  key: content,
                }
              : info,
          ),
        );

        cacheMessageInRoom(selectedRoom, {
          username: "system",
          text: "Key updated",
          time: current_time,
        });

        break;
      case "/username":
        if (!check_content()) return;
        //setUsername(content); // Set new username
        client.sendPayload({
          cmd: ClientCMD.CHANGE_USERNAME,
          data: { username: content },
        });
        break;
      case "/join":
        if (!check_content()) return;

        if (!chatInfos.find((info) => info.room === content)) {
          client.sendPayload({
            cmd: ClientCMD.JOIN_ROOM,
            data: { room: content },
          }); // Send join room payload
        }
        break;
      case "/leave":
        client.sendPayload({
          cmd: ClientCMD.LEAVE_ROOM,
          data: { room: selectedRoom },
        }); // Send join room payload
        break;
      case "/switch":
        if (chatInfos.some((chatInfo) => chatInfo.room === content)) {
          setSelectedRoom(content); // Set new room
        } else {
          cacheMessageInRoom(selectedRoom, {
            time: current_time,
            username: "system",
            text: `You are not in room '${content}'`,
          });
        }

        break;
      case "/clear":
        setChatInfos((prev) =>
          prev.map((info) =>
            info.room === selectedRoom ? { ...info, messages: [] } : info,
          ),
        );

        break;
      default:
        setChatInfos((prev) =>
          prev.map((info) =>
            info.room === selectedRoom
              ? {
                  ...info,
                  messages: [
                    ...info.messages,
                    {
                      username: "system",
                      text: `Unknown command '${command}'`,
                      time: getCurrentTimeUTC(),
                    },
                  ],
                }
              : info,
          ),
        );
        break;
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      if (message.startsWith("/")) {
        handleCommand(message);
        setMessage(""); // Clear input after sending
      } else {
        if (message === "cls") {
          setChatInfos((prev) =>
            prev.map((info) =>
              info.room === selectedRoom ? { ...info, messages: [] } : info,
            ),
          );
          setMessage(""); // Clear input after sending
          return;
        }

        const chatInfo = chatInfos.find((info) => info.room === selectedRoom);
        const key = chatInfo ? chatInfo.key : null;
        let encrypted_message = XOR(message, key);
        client.sendPayload({
          cmd: ClientCMD.MESSAGE,
          data: { message: encrypted_message, room: selectedRoom, username },
        });
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

  useEffect(() => {
    const wsClient = new WebSocketClient(process.env.NEXT_PUBLIC_WS_URL ?? "");
    wsClient.setCallback(serverCallback);
    console.log("System status is: ", wsClient.isConnectedStatus);

    setClient(wsClient);
  }, []);

  function CommandList() {
    return (
      <div
        className={`absolute -mt-[8.5rem] -ml-1 sm:ml-1 z-50 h-36 w-full
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
    <div className="w-full flex flex-col sm:flex-row flex-grow mt-4 mb-8">
      <div className="flex mt-3 sm:mt-[10px] text-primary w-fit h-fit text-nowrap">
        <div>{username}</div>
        <div>@</div>
        <div>{selectedRoom}</div>
        <div>:</div>
      </div>
      <div className="relative w-full">
        {<CommandList />}
        <input
          className="bg-transparent placeholder:text-neutral-700 text-base resize-none min-w-full py-2 px-0 sm:px-2"
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
