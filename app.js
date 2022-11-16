const express = require("express");
const app = express();
const path = require("path");
const socketio = require("socket.io");
const server = require("http").createServer(app);
const cors = require("cors");
const io = socketio(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("login-info-submit", (data) => {
    console.log(data);
    this.data = data;
  });

  socket.on("main-enter", () => {
    console.log("chat-enter");
    socket.join(this.data.chatroom);
    io.to(this.data.chatroom).emit("chat-enter", this.data);
  });

  socket.on("chat", (data) => {
    io.to(this.data.chatroom).emit("chat", data);
  });

  socket.on("leave-chat", () => {
    socket.to(this.data.chatroom).emit("leave-chat", this.data);
  });
});

// static folder 설정
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3383;
server.listen(PORT, () => console.log(`Listening port on : ${PORT}`));
