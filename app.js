const express = require("express");
const app = express();
const path = require("path");
const socketio = require("socket.io");
const server = require("http").createServer(app);
const cors = require("cors");
const io = socketio(server, { cors: { origin: "*" } });

let info;
io.on("connection", (socket) => {
  socket.on("login-info-submit", (data) => {
    info = data;
    console.log(info);
  });

  socket.on("main-enter", () => {
    console.log("chat-enter");
    socket.join(info.chatRoom);
    io.to(info.chatRoom).emit("chat-enter", info);
  });

  socket.on("Send", (data) => {
    io.to(info.chatroom).emit("Catch", data);
  });

  socket.on("leave-chat", () => {
    socket.to(info.chatroom).emit("leave-chat", info);
  });
});

// static folder 설정
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3383;
server.listen(PORT, () => console.log(`Listening port on : ${PORT}`));
