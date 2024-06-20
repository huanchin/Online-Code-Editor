const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { exec } = require("child_process");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("codeChange", (code) => {
    io.to("room1").emit("codeUpdate", code);
  });

  socket.on("runCode", (code, language) => {
    let command;
    switch (language) {
      case "python":
        command = `docker run --rm python python -c "${code.replace(
          /"/g,
          '\\"'
        )}"`;
        break;
      case "javascript":
        command = `docker run --rm node sh -c "node -e '${code.replace(
          /"/g,
          '\\"'
        )}'"`;

        break;
      case "cpp":
        const fs = require("fs");
        const filePath = "temp.cpp";
        fs.writeFileSync(filePath, code);
        command = `g++ ${filePath} -o temp && ./temp`;
        break;
      default:
        socket.emit("output", "Unsupported language");
        return;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        socket.emit("output", stderr);
        return;
      }
      console.log(stdout);
      socket.emit("output", stdout);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
