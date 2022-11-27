const express = require("express");
const app = express();
var server = require("http").createServer(app); // http server
var io = require("socket.io")(server); // http server -> socketio server

var userid;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/loginPage.html");
});

app.get("/main", (req, res) => {
  res.sendFile(__dirname + "/public/chatPage.html");
});

// on(eventname, cb) : eventListner
// socketio sever에 연결될 경우 실행
// socket은 개별 클라이언트와 interaction을 위한 객체
io.on("connection", (socket) => {
  socket.on("login", (data) => {
    console.log(data);
    userid = data.userId;
  });

  socket.on("Entering", () => {
    socket.emit("Entering", userid);
  });

  socket.on("chat", (data) => {
    socket.broadcast.emit(data);
  });
});

const Port = 3000;
server.listen(Port, () => {
  console.log("Listening on port 3000");
});
