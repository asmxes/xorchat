<div align="center">
  <a href="xor.chat">
    <img src="https://github-readme-tech-stack.vercel.app/api/cards?title=Tech+Stack&align=center&titleAlign=center&lineCount=1&theme=discord&hideTitle=true&bg=%23202226&badge=%232f3137&border=%232f3137&titleColor=%235865f2&line1=react%2Creact%2C45ceff%3Bnext.js%2Cnext.js%2Cffffff%3Btailwindcss%2Ctailwindcss%2Ca4f8ff%3Bbun%2Cbun%2Cffffff%3B" alt=" " />
  </a>
</div>

# 🌐 xor.chat | WebSocket Live Chat

Welcome to the **xor.chat**! This repository demonstrates a lightweight, high-performance live chat using Bun's `bun.serve`.

## ⚡ Key Features

- **Real-Time WebSocket Connections**: Connect, broadcast, and receive real-time data.
- **Fast & Lightweight**: Only the necessary, see what rooms you joined and how many people are connected, encrypt your messages with a key.
- **Customizable & Scalable**: Modify host and port for easy deployment and scaling.

## 📋 Requirements

- **[Bun](https://bun.sh/)** (For the WebSocket)
- **[Bun](https://bun.sh/)/[Node](https://nodejs.org/)/[Deno](https://deno.com/)** (for for the Next.js client)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/asmxes/xorchat
cd websocket-server-bun
```

### 2. Install Dependencies

Since Bun is our primary runtime, installation is as easy as:

```bash
bun/node/deno install
```

### 3. Configuration

Edit the host and port settings in `index.js` to suit your environment.

```javascript
bun.serve({
  hostname: "0.0.0.0", // Replace with your desired host
  port: 3001,          // Replace with your desired port
  ...
});
```

### 4. Run the Server

Start the WebSocket server with Bun:

```bash
bun/node/deno run ./app/server.ts
```

Your WebSocket server will now be live on the configured `hostname` and `port` (e.g., `ws://localhost:3001`).

## 📡 Usage

- **`/username`**: Change your global username, it will be unique across al rooms.
- **`/join`**: Join a room or switch to it if already joined. A new room will be created if it doesn't exist already.
- **`/key`**: Set a key to encrypt sent messages and decrypt received messages.
- **`/clear`**: Clears the chat for the current room.
- **`/leave`**: Leave the current room.




## 📄 License

This project is licensed under the MIT License.

---

Feel free to fork this repository, contribute, and give it a ⭐️ if you find it useful!

## ✨ Credits

Created with 💖 by [Your Name](https://github.com/yourusername)
