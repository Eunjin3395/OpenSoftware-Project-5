import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MainPage.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3383");
let cnt = 0;
export default function MainPage() {
  let Navigator = useNavigate();
  const [data, setData] = useState("Empty");
  const [userName, setUserName] = useState("Not Entered.");
  const [chatRoom, setChatRoom] = useState("Not Entered.");
  let [reRender, setReRender] = useState();

  function LeaveToLoginPage(event) {
    event.preventDefault();
    return Navigator("/");
  }
  function SendText(event) {
    event.preventDefault();
    socket.emit("Send", { userName: userName, msg: userInput.value });
    userInput.value = "";
  }
  let html = (
    <div id="MainPage-Container">
      <div id="Video-Interface">
        화상채팅창
        <div id="Video-Button-Container">
          <button>마이크 음소거</button>
          <button>화면 출력</button>
        </div>
      </div>
      <div Id="Chat-Interface">
        <div id="Chat-Container">
          <div id="chatroom">{chatRoom}</div>
          <ul id="chat"></ul>
        </div>

        <div id="Input-Container">
          <input type="text" id="userInput" />
          <button id="submit" onClick={SendText}>
            전송
          </button>
          <form onSubmit={LeaveToLoginPage} id="leave">
            <button>나가기</button>
          </form>
        </div>
      </div>
    </div>
  );

  let chatroom = document.getElementById("chatroom");
  let chat = document.getElementById("chat");
  let submitButton = document.getElementById("submit");
  let userInput = document.getElementById("userInput");

  useEffect(() => {
    if (userName != "Not Entered.") {
      socket.off("Catch").on("Catch", (data) => {
        //현재 socket.on이 여러번 반복실행됨 바깥은 실행안되고
        const li = document.createElement("li");
        li.innerText = data.userName + ": " + data.msg;
        chat.appendChild(li);
        console.log("Send message", chat);
      });
    }
  });

  useEffect(() => {
    socket.emit("main-enter", "entered");
    console.log("방 접속");
    if (data == "Empty") {
      console.log("data");
      socket.on("chat-enter", (d) => setData(d));
    }
  }, []);

  useEffect(() => {
    if (data != "Empty") {
      console.log("방 변경");
      setChatRoom(data.ChatRoom + "방");
    }
  }, [data]);

  useEffect(() => {
    if (data != "Empty") {
      if (userName == "Not Entered.") {
        console.log("이름 변경 전");
        setUserName(data.userName);
      }

      if (chatRoom != "Not Entered." && userName != "Not Entered.") {
        console.log("이름 변경 후");
        const li = document.createElement("li");
        li.innerText = data.userName + "입장하셨습니다.";
        chat.appendChild(li);
      }
      console.log(userName, chat);
    }
  }, [data, userName]);

  return html;
}
