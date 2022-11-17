import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3383");
export default function LoginPage() {
  const Navigate = useNavigate();
  const [UserName, setUserName] = useState("");
  const [ChatRoom, setChatRoom] = useState("");

  function UserNameHanler(event) {
    setUserName(event.currentTarget.value);
  }

  function ChatRoomHanler(event) {
    setChatRoom(event.currentTarget.value);
  }

  function SubmitHandler(event) {
    event.preventDefault();
    socket.emit("login-info-submit", {
      userName: UserName,
      ChatRoom: ChatRoom,
    });
    return Navigate("/main");
  }

  return (
    <div className="LoginPage-Container">
      <div className="Container">
        <div>LoginPage</div>
        <form onSubmit={SubmitHandler}>
          <input
            type="text"
            className="UserName"
            value={UserName}
            onChange={UserNameHanler}
            placeholder="Enter User name"
          ></input>
          <input
            type="text"
            className="ChatRoom"
            value={ChatRoom}
            onChange={ChatRoomHanler}
            placeholder="Enter ChatRoom name"
          ></input>
          <button className="submit" type="submit">
            submit
          </button>
        </form>
      </div>
    </div>
  );
}
