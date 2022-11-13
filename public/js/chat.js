var socket = io();
let chatroom = document.getElementById("chatroom");
let chat = document.getElementById("chat");
let submitButton = document.getElementById("submit");
let userInput = document.getElementById("userInput");
let username;

// 처음 입장시 문구 출력
socket.emit("chat-enter", "entered");
socket.on("chat-enter", (data) => {
  username = data.username;
  chatroom.innerHTML = data.chatroom + "방";
  const li = document.createElement("li");
  li.innerText = `${username}님이 입장하셨습니다.`;
  chat.appendChild(li);
});

// 퇴장 시 출력되는 문구
leave.addEventListener("submit", (e) => {
  socket.emit("leave-chat", "");
});

socket.on("leave-chat", (data) => {
  const li = document.createElement("li");
  li.innerText = `${data.username}님이 퇴장하셨습니다.`;
  chat.appendChild(li);
});

// 메시지 보내기
submitButton.addEventListener("click", () => {
  socket.emit("chat", userInput.value);
});

socket.on("chat", (data) => {
  const li = document.createElement("li");
  li.innerText = `${username} : ${data}`;
  chat.appendChild(li);
  console.log(li);
});
