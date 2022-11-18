import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LobbyPage.css";
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
    socket.emit("leave-chat", userName);
    return Navigator("/");
  }

  let html = (
    <div id='MainPage-Container'>
      <div id='NabBar'>
        <div id='chatroom'>{chatRoom}</div>
        <form onSubmit={LeaveToLoginPage} id='leave'>
          <button>나가기</button>
        </form>
      </div>

      <div className='Video-Chat-Input-container'>
        <div id='Video-Interface'>
          화상채팅창
          <div id='Video-Button-Container'>
            <button>마이크 음소거</button>
            <button>화면 출력</button>
          </div>
        </div>

        <div className='Chat-Input-Container'>
          <div id='Chat-Interface'>
            <div id='Chat-Container'>
              <ul id='chat'></ul>
            </div>

            <div id='Input-Container'>
              <input type='text' id='User-Input' />
              <button id='submit' onClick={SendText}>
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  let chatroom = document.getElementById("chatroom");
  let chat = document.getElementById("chat");
  let submitButton = document.getElementById("submit");
  let userInput = document.getElementById("User-Input");
  function SendText(event) {
    event.preventDefault();
    socket.emit("Send", { userName: userName, msg: userInput.value });
    userInput.value = "";
  }
  useEffect(() => {
    if (userName != "Not Entered.") {
      socket.off("Catch").on("Catch", (data) => {
        const li = document.createElement("li");
        li.innerText = data.userName + " : " + data.msg;
        chat.appendChild(li);
        console.log("Send message", chat);
      });

      socket.on("leave-chat", (data) => {
        const li = document.createElement("li");
        li.innerText = data + "님이 퇴장하셨습니다.";
        chat.appendChild(li);
      });
    }
  });

  //메인 페이지 접속시 실행.
  // 데이터가 비었다면 데이터를 받아옴.
  useEffect(() => {
    socket.emit("main-enter", "entered");
    console.log("로그인 완료");
    if (data == "Empty") {
      console.log("data");
      socket.on("chat-enter", (d) => setData(d));
    }
  }, []);

  // 방 이름 변수 추가
  useEffect(() => {
    if (data != "Empty") {
      console.log("방 변경");
      setChatRoom(data.ChatRoom + "방");
    }
  }, [data]);

  // 유저 이름 변수 추가
  // 입장 메시지 출력
  useEffect(() => {
    if (data != "Empty") {
      if (userName == "Not Entered.") {
        setUserName(data.userName);
      }

      if (chatRoom != "Not Entered." && userName != "Not Entered.") {
        const li = document.createElement("li");
        li.innerText = data.userName + "님이 입장하셨습니다.";
        chat.appendChild(li);
      }
      console.log(userName, chat);
    }
  }, [data, userName]);

  return html;
}
