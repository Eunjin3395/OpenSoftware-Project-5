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
    let img;
    switch (userImg) {
      case yellow:
        img = yellow;
        break;
      case red:
        img = red;
        break;
      case orange:
        img = orange;
        break;
      case blue:
        img = blue;
        break;
      case purple:
        img = purple;
        break;
    }

    socket.emit("login", {
      nickname: UserName,
      Room: ChatRoom,
      img: img,
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
        <img src={userImg} onClick={ImgChanger} className='loginImg' />
        <form onSubmit={SubmitHandler}>
          <div className='userInput'>
            <input
              type='text'
              className='UserName'
              value={UserName}
              onChange={UserNameHanler}
              placeholder='Enter User name'
            />
          </div>
          <button className='submit' type='submit'>
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
