
<div align="center">
  <a href="xor.chat">
    <img src="https://github-readme-tech-stack.vercel.app/api/cards?title=Tech+Stack&align=center&titleAlign=center&lineCount=1&theme=discord&hideTitle=true&bg=%23202226&badge=%232f3137&border=%232f3137&titleColor=%235865f2&line1=react%2Creact%2C45ceff%3Bnext.js%2Cnext.js%2Cffffff%3Btailwindcss%2Ctailwindcss%2Ca4f8ff%3Bbun%2Cbun%2Cffffff%3B" alt=" " />
  </a>
</div>

---

# 🌐 xor.chat

Welcome to the **xor.chat**! This repository demonstrates a lightweight, high-performance, privacy-focused live chat using Bun's `bun.serve`.

## ⚡ Key Features

- **Real-Time WebSocket Connections**: Connect, broadcast, and receive real-time data.
- **Fast & Lightweight**: Only the necessary, see what rooms you joined and how many people are connected, encrypt your messages with a key.
- **Server-less**: No data is saved anywhere, rooms are created when used and destroyed when empty, messages are broadcasted to connected clients without saving anything on disk. If you want to clear the chat, simply `/clear` or refresh the page.
- **Customizable & Scalable**: Start the server, run the UI and you are ready to chat.


## 📋 Requirements

- **[Bun](https://bun.sh/)** (For the WebSocket)
- **[Bun](https://bun.sh/)/[Node](https://nodejs.org/)/[Deno](https://deno.com/)** (for for the Next.js UI client)

## 🚀 Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/asmxes/xorchat
cd xorchat
```

### 2. Install Dependencies


```sh
bun/node/deno install
```

### 3. Configuration

Edit the host and port settings in `app/server.ts` to suit your environment.

```javascript
bun.serve({
  hostname: "0.0.0.0", // Replace with your desired host
  port: 3001,          // Replace with your desired port
  ...
});
```

Then:

```sh
touch .env.local & nano .env.local
```

Finally make sure you define the `NEXT_PUBLIC_WS_URL` variable like this:

```
NEXT_PUBLIC_WS_URL=ws://{yourhostname}:{yourport}
```

### 4. Run the Server

Start the WebSocket server with Bun:

```sh
bun/node/deno run ./app/server.ts
```

### 4. Run the Client

```sh
bun/node/deno run dev
```

That's it!

## 📡 Usage

- **`/username`**: Change your global username, it will be unique across al rooms.
- **`/join`**: Join a room or switch to it if already joined. A new room will be created if it doesn't exist already.
- **`/key`**: Set a key to encrypt sent messages and decrypt received messages.
- **`/clear`**: Clears the chat for the current room.
- **`/leave`**: Leave the current room.




## 📄 License

This project is licensed under the MIT License.

---

Feel free to fork this repository and contribute (there's still alot of QOL features to add), and give it a ⭐️ if you find it useful!

## ✨ Credits

Created with 💖 by [asm](https://github.com/asmxes)
