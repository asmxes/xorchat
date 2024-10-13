const rooms = {};

const server = Bun.serve({
  port: 3001,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("WebSocket connection required", { status: 426 });
  },
  websocket: {
    open(ws) {
      ws.room = null;
      ws.username = null;
      console.log("WebSocket connection opened");
    },
    message(ws, message) {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.type === "message") {
        const { room, text } = parsedMessage;
        broadcastMessage(room, ws.username, text);
      } else if (parsedMessage.type === "join") {
        const { room, username } = parsedMessage;

        if (username === "guest" || username === "system") {
          ws.send(
            JSON.stringify({
              username: "system",
              type: "error",
              message: "Invalid username",
            }),
          );
          ws.close();
          return;
        }

        if (room === "local" || room.length < 4) {
          ws.send(
            JSON.stringify({
              username: "system",
              type: "error",
              message: "Invalid room",
            }),
          );
          ws.close();
          return;
        }

        ws.username = username;
        ws.room = room;

        if (!rooms[room]) {
          rooms[room] = [];
        }

        rooms[room].push(ws);

        broadcastSystemMessage(room, `User ${username} has joined the room`);
      } else if (parsedMessage.type === "username") {
      }

      console.log("Received:", message);
      ws.send(`Echo: ${message}`);
    },
    close(ws) {
      if (ws.room && rooms[ws.room]) {
        rooms[ws.room] = rooms[ws.room].filter((client) => client !== ws);
        broadcastSystemMessage(
          ws.room,
          `User ${ws.username} has left the room`,
        );
        if (rooms[ws.room].length === 0) {
          delete rooms[ws.room];
        }
      }
      console.log("WebSocket connection closed");
    },
  },
});

console.log("WebSocket server running on ws://localhost:3001");

function broadcastMessage(room, username, text) {
  const clients = rooms[room] || [];
  clients.forEach((client) => {
    client.send(JSON.stringify({ type: "message", username, text }));
  });
}

function broadcastSystemMessage(room, text) {
  const clients = rooms[room] || [];
  clients.forEach((client) => {
    client.send(JSON.stringify({ type: "system", text }));
  });
}
