var socket = io();

var login = document.getElementById("login-form");
var data;

// 처음 입력창에서 받아온 데이터를 서버로 전송.
login.addEventListener("submit", (e) => {
  var info = document.getElementsByTagName("input");
  data = { username: info[0].value, chatroom: info[1].value };
  socket.emit("login-info-submit", data);
});
