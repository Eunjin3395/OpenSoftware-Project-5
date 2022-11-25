import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
import io from "socket.io-client";
import yellow from "../../images/yellow.png";
import red from "../../images/red.png";
import blue from "../../images/blue.png";
import orange from "../../images/orange.png";
import purple from "../../images/purple.png";
const socket = io.connect("http://localhost:3383");
export default function LoginPage() {
  const Navigate = useNavigate();
  const [UserName, setUserName] = useState("");
  const [ChatRoom, setChatRoom] = useState("");
  const [userImg, setUserImg] = useState(yellow);
  function UserNameHanler(event) {
    setUserName(event.currentTarget.value);
  }

  function ChatRoomHanler(event) {
    setChatRoom(event.currentTarget.value);
  }

  function SubmitHandler(event) {
    event.preventDefault();
    socket.emit("login", {
      nickname: UserName,
      Room: ChatRoom,
    });
    return Navigate("/main");
  }

  function ImgChanger(e) {
    switch (userImg) {
      case yellow:
        setUserImg(red);
        break;
      case red:
        setUserImg(blue);
        break;
      case blue:
        setUserImg(orange);
        break;
      case orange:
        setUserImg(purple);
        break;
      case purple:
        setUserImg(yellow);
        break;
    }
  }

  return (
    <div className='LoginPage-Container'>
      <div className='Container'>
        <div>"프로그램 이름"</div>
        <button onClick={ImgChanger} className='imgButton'>
          <img src={userImg} />
        </button>

        <form onSubmit={SubmitHandler}>
          <div className='userInput'>
            <input
              type='text'
              className='UserName'
              value={UserName}
              onChange={UserNameHanler}
              placeholder='Enter User name'
            />
            <div>구글에서 정보받아오는 부분</div>
          </div>

          <button className='submit' type='submit'>
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
