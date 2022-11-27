import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ChattingPage.css";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3383");

export default function ChattingPage() {
  let Navigator = useNavigate();
  const [data, setData] = useState("Empty");
  const [userName, setUserName] = useState("Empty");
  const [chatRoom, setChatRoom] = useState("Empty");
  const [userImg, setUserImg] = useState("Empty");
  let userInput = document.getElementById("User-Input");
  let chat = document.getElementById("chat");
  let img = document.getElementById("userImg");
  let submitButton = document.getElementById("submit");
  let Approved = false;
  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////

  // 채팅페이지 템플릿
  // NabBar : 최상단 방의 이름 및 정보를 표시
  // chatroom : 현재 페이지의 이름
  // Video-Chat-Input-container : 화상통화 및 채팅창을 담당
  // Video-Interface : 화상 통화가 여기서 출력됨
  // Video-Button-Container : 음소거 및 화면 출력 버튼이 위치
  // Chat-Input-Container : 채팅창과 관련된 것들을 포함
  // Chat-Container : 채팅 출력창
  // Input-Container : 사용자 입력창

  console.log(userImg);
  let html = (
    <div id='MainPage-Container'>
      <div id='NabBar'>
        <div id='chatroom'>
          <img src='' id='userImg' />
          {chatRoom}
        </div>
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
  );

  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////

  //메인 페이지 접속시 실행.
  // 데이터가 비었다면 데이터를 야무지게 받아옴.
  useEffect(() => {
    if (data == "Empty") {
      socket.emit("info-req");
      socket.on("login-result", (d) => {
        setData(d);
      });
    }
  });

  // 테스트 용
  // data loading 이후 제대로 값이 들어왔다면 출력
  useEffect(() => {
    if (
      data != "Empty" &&
      chatRoom != "Empty" &&
      userName != "Empty" &&
      userImg != "Empty"
    ) {
      Approved = true;
      console.log(`chatRoom : ${chatRoom}`);
      console.log(`userName : ${userName}`);
      console.log(`userImg : ${userImg}`);
    }
  }, [userImg]);

  // 유저가 입장 시 유저 이름을 업데이트
  useEffect(() => {
    if (data != "Empty") {
      if (userName == "Empty") {
        setUserName(data.nickname);
      }
    }
  }, [data, userName]);

  // 유저가 입장 시 채팅방 이름을 업데이트
  useEffect(() => {
    if (chatRoom != "Empty" && userName != "Empty") {
      // 로비 페이지 완성 시 주석으로 변경
      // socket.on("notify-message", message=>{
      //    const li = document.createElement("li");
      //     li.innerText = message;
      //     chat.appendChild(li);
      // });
      while (chat.hasChildNodes()) {
        chat.removeChild(chat.firstChild);
      }
      console.log("clear", chat);
      const li = document.createElement("li");
      li.innerText = userName + "님이 입장하셨습니다.";
      chat.appendChild(li);
    }
  }, [userName]);

  // 전송 버튼을 누르면 실행
  // 메세지를 서버로 전송
  function SendText(event) {
    event.preventDefault();
    socket.emit("chat-message", userInput.value);
    userInput.value = "";
  }

  // 서버에서 전송받은 메세지를 사용자 화면에 출력
  useEffect(() => {
    if (Approved) {
      socket.off("chat-message").on("chat-message", (data) => {
        const li = document.createElement("li");
        li.innerText = data.userName + " : " + data.msg;
        chat.appendChild(li);
      });
    }
  });

  // 현재 위치하고 있는 방의 정보를 서버로부터 받은 후 업데이트
  useEffect(() => {
    if (data != "Empty") {
      setChatRoom(data.ChatRoom + " 방");
    }
  }, [data]);

  useEffect(() => {
    if (data != "Empty" && userImg) {
      img.src = data.userImg;
      setUserImg(data.userImg);
    }
  }, [data]);

  // logout 컨트롤러
  function LeaveToLoginPage(event) {
    event.preventDefault();
    socket.emit("room-out", userName);
    return Navigator("/");
  }

  return html;
}
