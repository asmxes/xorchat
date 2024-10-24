// WebSocketClient.ts
import {
  ClientData,
  ClientCMD,
  ClientPayload,
  ServerData,
  ServerCMD,
  ServerPayload,
} from "../types";

class WebSocketClient {
  private ws: WebSocket;
  private isConnected: boolean = false;
  private callback: ((payload: ServerPayload) => void) | null = null;

  constructor(url: string) {
    console.log("Connecting to: ", url);
    this.ws = new WebSocket(url);

    // Handle WebSocket open event
    this.ws.onopen = () => {
      console.log("Connected to server");
      this.isConnected = true;

      const payload: ServerPayload = {
        cmd: ServerCMD.INFO,
        data: { message: "Connected to system" },
      };

      if (this.callback) {
        // this.callback(payload);
      }
    };

    // Handle incoming messages
    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const serverPayload: ServerPayload = JSON.parse(event.data);

        if (this.callback) {
          console.log(serverPayload);
          this.callback(serverPayload);
        }
      } catch (error) {
        console.error("Error parsing server message:", error);
        if (this.callback) {
          const errorPayload: ServerPayload = {
            cmd: ServerCMD.ERROR,
            data: { message: "System error" },
          };
          this.callback(errorPayload);
        }
      }
    };

    // Handle WebSocket error
    this.ws.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
      const errorPayload: ServerPayload = {
        cmd: ServerCMD.ERROR,
        data: { message: JSON.stringify(error) },
      };
      console.log(errorPayload);
      // if (this.callback) this.callback(errorPayload);
    };

    // Handle WebSocket close event
    this.ws.onclose = () => {
      console.log("System connection closed");
      this.isConnected = false;
      const payload: ServerPayload = {
        cmd: ServerCMD.INFO,
        data: { message: "Lost connection to system" },
      };
      if (this.callback) this.callback(payload);
      console.log(payload);
    };
  }

  // Set callback function for server messages
  setCallback(cb: (payload: ServerPayload) => void) {
    this.callback = cb;
  }

  // Send payload to the WebSocket server
  sendPayload(payload: ClientPayload) {
    if (!this.isConnected) {
      console.error("Cannot send message. System is not connected.");
      const errorPayload: ServerPayload = {
        cmd: ServerCMD.ERROR,
        data: { message: "Not connected to remote system" },
      };
      if (this.callback) this.callback(errorPayload);
      return;
    }

    try {
      const payloadString = JSON.stringify(payload);
      this.ws.send(payloadString);
      console.log("Sent payload:", payloadString);
    } catch (error) {
      console.error("Error sending payload:", error);
      const errorPayload: ServerPayload = {
        cmd: ServerCMD.ERROR,
        data: { message: "Failed to send payload" },
      };
      if (this.callback) this.callback(errorPayload);
    }
  }

  // Check if the client is connected
  get isConnectedStatus() {
    return this.isConnected;
  }

  // Close the WebSocket connection
  closeConnection() {
    this.ws.close();
  }
}

export default WebSocketClient;
