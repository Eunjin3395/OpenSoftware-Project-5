import React, { useState, useEffect } from "react";
import "../css/LoginPage.css";
import io from "socket.io-client";

let chatroom = document.getElementById("chatroom");
let chat = document.getElementById("chat");
let submitButton = document.getElementById("submit");
let userInput = document.getElementById("userInput");
const socket = io.connect("http://localhost:3383");

export default function MainPage() {
  socket.emit("main-enter", "entered");

  socket.on("chat-enter", (data) => {
    console.log("asdf");
    // username = setUsername(data.username);
    // chatroom.innerHTML = data.chatroom + "방";
    // const li = document.createElement("li");
    // li.innerText = `${username}님이 입장하셨습니다.`;
    // chat.appendChild(li);
  });

  return (
    <>
      <h1>chatting room</h1>
      <div id='chatroom'></div>
      <ul id='chat'></ul>
      <div class='input-container'>
        <input type='text' id='userInput' />
        <button id='submit'>전송</button>
      </div>
      <form action='index.html' id='leave'>
        <button>나가기</button>
      </form>
    </>
  );
}
