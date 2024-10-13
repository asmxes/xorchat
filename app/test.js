// Replace 'ws://localhost:3001' with your WebSocket server URL
const ws = new WebSocket("ws://localhost:3001");

// Event: Connection opened
ws.onopen = function () {
  console.log("Connected to WebSocket server");

  // Example: Sending a message to the server
  ws.send("Hello, WebSocket server!");
};

// Event: Receiving a message from the server
ws.onmessage = function (event) {
  console.log("Message from server:", event.data);
};

// Event: Error occurred
ws.onerror = function (error) {
  console.error("WebSocket error:", error);
};

// Event: Connection closed
ws.onclose = function () {
  console.log("WebSocket connection closed");
};
