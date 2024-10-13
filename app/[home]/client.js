"use client";

// Replace 'ws://localhost:3001' with your WebSocket server URL
const ws = new WebSocket("ws://localhost:3001");
let is_connected;
let callback = null;
const set_callback = (cb) => {
  callback = cb;
};

// Event: Connection opened
ws.onopen = function () {
  console.log("Connected to WebSocket server");
  if (callback) callback({ type: "system", message: "Connected to system" });
  is_connected = true;
};

// Event: Receiving a message from the server
ws.onmessage = function (event) {
  console.log("Message from server:", event.data);
  if (callback) callback({ type: "message", data: event.data });
};

// Event: Error occurred
ws.onerror = function (error) {
  console.error("WebSocket error:", error);
  if (callback) callback({ type: "error", message: error });
};

// Event: Connection closed
ws.onclose = function () {
  console.log("WebSocket connection closed");
  if (callback)
    callback({ type: "system", message: "Lost connection to system" });
  is_connected = false;
};

export { ws, is_connected, set_callback };
