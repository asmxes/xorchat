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
      ws.room = null;
      ws.username = null;
      console.log("WebSocket connection opened");
    },
    message(ws: WebSocketWithRoom, message: string) {
      let parsed_message: ClientPayload = {};
      try {
        parsed_message = JSON.parse(message);
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

          broadcastInfo(
            ws.room ?? "null",
            `${old_username} is now known as ${ws.username}`,
          );
          break;
        }

        case ClientCMD.JOIN_ROOM: {
          if (
            !ws.username ||
            ws.username === "guest" ||
            ws.username === "system"
          ) {
            sendError(ws, "Invalid username");
            return;
          }

          const roomToJoin = parsed_message.data?.room ?? "";
          if (roomToJoin === "local" || roomToJoin.length < 1) {
            sendError(ws, "Invalid room");
            return;
          }

          if (ws.room) {
            // Remove from old room
            leaveRoom(ws);
          }

          ws.room = roomToJoin;
          if (!rooms[ws.room]) {
            rooms[ws.room] = [];
          }

          rooms[ws.room].push(ws);
          broadcastInfo(ws.room, `User ${ws.username} has joined the room`);
          break;
        }

        case ClientCMD.LEAVE_ROOM: {
          if (!ws.room || !rooms[ws.room]) {
            sendError(ws, "You are not in a room");
            return;
          }

          leaveRoom(ws);
          break;
        }

        case ClientCMD.MESSAGE: {
          if (!ws.room || !rooms[ws.room]) {
            sendError(ws, "You are not in a room");
            return;
          }

          const userMessage = parsed_message.data?.message ?? "";
          if (userMessage.length === 0) {
            sendError(ws, "Cannot send an empty message");
            return;
          }

          broadcastMessage(ws.room, ws.username ?? "unknown", userMessage);
          break;
        }

        default:
          sendError(ws, "Unknown command");
          break;
      }
    },
    close(ws: WebSocketWithRoom) {
      leaveRoom(ws);
      console.log("WebSocket connection closed");
    },
  },
});

console.log("WebSocket server running on", process.env.NEXT_PUBLIC_WS_URL);

function broadcastMessage(room: string, username: string, message: string) {
  const clients = rooms[room] || [];

  const data: ServerData = { username, message };
  const payload: ServerPayload = { cmd: ServerCMD.MESSAGE, data };

  clients.forEach((client) => {
    client.send(JSON.stringify(payload));
  });
}

function broadcastInfo(room: string, message: string) {
  const clients = rooms[room] || [];
  console.log("Broadcasting: ", message);
  console.log("to : ", clients.length);

  const data: ServerData = { username: undefined, message };
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

function leaveRoom(ws: WebSocketWithRoom) {
  if (!ws.room || !rooms[ws.room]) return;

  broadcastInfo(ws.room, `User ${ws.username} has left the room`);

  rooms[ws.room] = rooms[ws.room].filter((client) => client !== ws);

  if (rooms[ws.room].length === 0) {
    delete rooms[ws.room];
  }

  ws.room = null;
}
