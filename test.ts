// Import the WebSocket from Bun (or Node.js WebSocket)
const ws = new WebSocket("ws://localhost:3001");

// Define a delay function to control message flow
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Define the WebSocket commands and data types
enum ClientCMD {
  CHANGE_USERNAME = 0,
  JOIN_ROOM,
  LEAVE_ROOM,
  MESSAGE,
}

interface ClientPayload {
  cmd: ClientCMD;
  data?: {
    username?: string;
    room?: string;
    message?: string;
  };
}

// Handle WebSocket connection
ws.onopen = async function () {
  console.log("Connected to the WebSocket server.");

  // Test 1: Change username
  console.log("Test 1: Changing username...");
  ws.send(JSON.stringify({
    cmd: ClientCMD.CHANGE_USERNAME,
    data: { username: "test_user" }
  }));

  await delay(500); // Wait for a response

  // Test 2: Join a room
  console.log("Test 2: Joining room...");
  ws.send(JSON.stringify({
    cmd: ClientCMD.JOIN_ROOM,
    data: { room: "casa" }
  }));

  await delay(500);

  // Test 3: Send a message to the room
  console.log("Test 3: Sending a message...");
  ws.send(JSON.stringify({
    cmd: ClientCMD.MESSAGE,
    data: { message: "Hello, world!" }
  }));

  await delay(500);

  // Test 4: Leave the room
  console.log("Test 4: Leaving the room...");
  ws.send(JSON.stringify({
    cmd: ClientCMD.LEAVE_ROOM
  }));

  await delay(500);

  // Close the WebSocket connection
  console.log("Closing connection...");
  ws.close();
};

// Handle incoming WebSocket messages from the server
ws.onmessage = function (event) {
  console.log("Received from server:", event.data);
};

// Handle WebSocket closure
ws.onclose = function () {
  console.log("Disconnected from the WebSocket server.");
};

// Handle WebSocket errors
ws.onerror = function (error) {
  console.error("WebSocket error:", error);
};
