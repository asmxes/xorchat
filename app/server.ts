import {
  ClientData,
  ClientCMD,
  ClientPayload,
  ServerData,
  ServerCMD,
  ServerPayload,
  WebSocketWithRoom,
} from "./types";

const rooms: { [key: string]: WebSocketWithRoom[] } = {};

Bun.serve({
  port: 3001,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("WebSocket connection required", { status: 426 });
  },
  websocket: {
    open(ws: WebSocketWithRoom) {
      ws.rooms = [];
      ws.username = null;
      console.log("WebSocket connection opened");
    },
    message(ws: WebSocketWithRoom, message: string) {
      let parsed_message: ClientPayload = {};
      try {
        parsed_message = JSON.parse(message);
        console.log("Received:");
        console.log(parsed_message);
      } catch (error) {
        console.error("Error parsing message:", error);
        if (error instanceof Error) {
          sendError(ws, error.message);
        } else {
          sendError(ws, "An unknown error occurred");
        }
        return;
      }

      switch (parsed_message.cmd) {
        case ClientCMD.CHANGE_USERNAME: {
          const newUsername = parsed_message.data?.username ?? "";
          if (
            newUsername === "guest" ||
            newUsername === "system" ||
            newUsername.length < 1
          ) {
            sendError(ws, "Invalid username");
            return;
          }

          let old_username = ws.username;
          ws.username = newUsername;

          const data: ServerData = { username: newUsername };
          const payload: ServerPayload = {
            cmd: ServerCMD.USERNAME_CHANGED,
            data,
          };

          ws.send(JSON.stringify(payload));

          for (const room of ws.rooms) {
            broadCastMembersUpdate(room);
            broadcastInfo(
              room,
              `${old_username} is now known as ${ws.username}`,
            );
          }

          break;
        }

        case ClientCMD.JOIN_ROOM: {
          if (
            !ws.username ||
            ws.username === "guest" ||
            ws.username === "system"
          ) {
            sendError(ws, "You need a custom username first");
            return;
          }

          const roomToJoin = parsed_message.data?.room ?? "";
          if (roomToJoin === "local" || roomToJoin.length < 1) {
            sendError(ws, "Invalid room");
            return;
          }

          if (!ws.rooms.includes(roomToJoin)) {
            const data: ServerData = { room: roomToJoin };
            const payload: ServerPayload = {
              cmd: ServerCMD.ROOM_JOINED,
              data,
            };

            ws.send(JSON.stringify(payload));

            ws.rooms.push(roomToJoin);
            if (!rooms[roomToJoin]) rooms[roomToJoin] = [];
            rooms[roomToJoin].push(ws);

            broadcastInfo(
              roomToJoin,
              `User ${ws.username} has joined the room`,
            );
            broadCastMembersUpdate(roomToJoin);
          }
          break;
        }

        case ClientCMD.LEAVE_ROOM: {
          const roomToLeave = parsed_message.data?.room ?? "";
          if (roomToLeave === "local" || roomToLeave.length < 1) {
            sendError(ws, "Invalid room");
            return;
          }

          if (
            !ws.rooms ||
            !ws.rooms.includes(roomToLeave) ||
            !rooms[roomToLeave]
          ) {
            sendError(ws, "You are not in a room");
            return;
          }

          const data: ServerData = { room: roomToLeave };
          const payload: ServerPayload = {
            cmd: ServerCMD.ROOM_LEFT,
            data,
          };

          ws.send(JSON.stringify(payload));

          broadCastMembersUpdate(roomToLeave);
          leaveRoom(ws, roomToLeave);
          break;
        }

        case ClientCMD.MESSAGE: {
          const roomToMessage = parsed_message.data?.room ?? "";
          if (roomToMessage === "local" || roomToMessage.length < 1) {
            sendError(ws, "Invalid room");
            return;
          }

          if (
            !ws.rooms ||
            !ws.rooms.includes(roomToMessage) ||
            !rooms[roomToMessage]
          ) {
            sendError(ws, "You are not in a room");
            return;
          }

          const userMessage = parsed_message.data?.message ?? "";
          if (userMessage.length === 0) {
            sendError(ws, "Cannot send an empty message");
            return;
          }

          broadcastMessage(
            roomToMessage,
            ws.username ?? "unknown",
            userMessage,
          );
          break;
        }

        default:
          sendError(ws, "Unknown command");
          break;
      }
    },
    close(ws: WebSocketWithRoom) {
      ws.rooms.forEach((room) => leaveRoom(ws, room));
      console.log("WebSocket connection closed");
    },
  },
});

console.log("WebSocket server running on", process.env.NEXT_PUBLIC_WS_URL);

function broadCastMembersUpdate(room: string) {
  const clients = rooms[room] || [];
  let members: string[] = [];
  for (let i = 0; i < clients.length; i++) {
    members.push(clients[i].username ?? "");
  }
  const data: ServerData = { members, room };
  const payload: ServerPayload = { cmd: ServerCMD.MEMBERS, data };

  console.log(payload);

  clients.forEach((client) => {
    client.send(JSON.stringify(payload));
  });
}

function broadcastMessage(room: string, username: string, message: string) {
  const clients = rooms[room] || [];

  const data: ServerData = { username, message, room };
  const payload: ServerPayload = { cmd: ServerCMD.MESSAGE, data };

  clients.forEach((client) => {
    client.send(JSON.stringify(payload));
  });
}

function broadcastInfo(room: string, message: string) {
  const clients = rooms[room] || [];
  console.log("Broadcasting: ", message);
  console.log("to : ", clients.length);

  const data: ServerData = { username: undefined, message, room };
  const payload: ServerPayload = { cmd: ServerCMD.INFO, data };

  clients.forEach((client) => {
    client.send(JSON.stringify(payload));
  });
}

function sendError(ws: WebSocketWithRoom, message: string) {
  const data: ServerData = { username: undefined, message };
  const payload: ServerPayload = { cmd: ServerCMD.ERROR, data };

  ws.send(JSON.stringify(payload));
}

function leaveRoom(ws: WebSocketWithRoom, room: string) {
  if (!rooms[room]) return;
  rooms[room] = rooms[room].filter((client) => client !== ws);
  ws.rooms = ws.rooms.filter((r) => r !== room);
  if (rooms[room].length === 0) delete rooms[room];
  broadcastInfo(room, `User ${ws.username} left the room`);
  broadCastMembersUpdate(room);
}
