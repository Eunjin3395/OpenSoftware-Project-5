const express = require("express");
const app = express();
const path = require("path");
const socketio = require("socket.io");
const server = require("http").createServer(app);
const cors = require("cors");
const io = socketio(server, { cors: { origin: "*" } });


let rooms = new Array(); //-> 아래와 같은 room 객체를 가진 array, 전체 active한 방의 정보들을 저장

// rooms[0]={
//   roomname:'', -> 채팅방 이름
//   memNum:0, -> 현재 채팅방에 들어가있는 인원수
//   memList:[], -> 멤버들의 name으로 구성
//   isSecret:false, -> 채팅방의 비밀방 여부
//   secretCode:'', -> 채팅방의 비밀코드
//   limit:0, -> 채팅방의 제한인원
//   adminNick:'' -> 방장의 nickname
// }


// roomname받아 해당 room 객체 리턴하는 함수
function getRoomByName(nameInput) {
  let result = {};
  rooms.forEach((room) => {
    if (room.roomname == nameInput) result = room;
  });
  return result;
}

// roomname받아 해당 room에 있는 member들의 nickname list 리턴하는 함수
function getMemberInRoom(nameInput) {
  let result = new Array();
  memberSet = io.sockets.adapter.rooms.get(nameInput);
  for (const member of memberSet) {
    let sock = io.sockets.sockets.get(member);
    result.push(sock.nickname);
  }
  return result;
}

// rooms array 안의 전체 room들의 인원수/멤버리스트 업데이트하는 함수, 파라미터에 roomname 넘겨주면 그 room을 삭제함
function roomUpdate(delRoom = "") { //해당 room을 삭제해야하는 경우 roomname을 받음
  //rooms array에 있는 모든 방에 대해 다음을 실행
  for (var i = 0; i < rooms.length; i++) {
    if (delRoom) {
      // 삭제돼야할 room 있을경우 rooms array에서 해당 room을 삭제
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].roomname == delRoom) {
          rooms.splice(i, 1);
          i--;
        }
      }
    } else {
      // 삭제 이외의 event 발생했을 떄는 인원수와 멤버리스트 갱신
      rooms[i].memList = getMemberInRoom(rooms[i].roomname);
      rooms[i].memNum = io.sockets.adapter.rooms.get(rooms[i].roomname).size;
    }
  }
}


// let info;
io.on("connection", (socket) => {
  console.log("a user connected");

  // 이전 민철님 백엔드
  // socket.on("login-info-submit", (data) => {
  //   info = data;
  //   console.log(info);
  // });

  // socket.on("main-enter", () => {
  //   console.log("chat-enter");
  //   socket.join(info.chatRoom);
  //   io.to(info.chatRoom).emit("chat-enter", info);
  // });

  // socket.on("Send", (data) => {
  //   io.to(info.chatroom).emit("Catch", data);
  // });

  // socket.on("leave-chat", (data) => {
  //   socket.to(info.chatroom).emit("leave-chat", data);
  // });



  // EJ 백엔드

  // 창 새로고침하거나 창 닫아서 socket이 disconnect됐을 때
  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (getRoomByName(socket.roomname).memNum == 1) // 내가 이 방의 마지막 남은 1명인데 내가 disconnect된 경우
      roomUpdate(socket.roomname); // 해당 room 삭제
    else { // 채팅방에 msg남기고 전체 rooms array update
      io.sockets
        .in(socket.roomname)
        .emit("notify message", `${socket.nickname} left this room.`);
      roomUpdate();
    }
    // lobby의 room list 갱신 위한 emit
    socket.broadcast.emit("room update", rooms);
  });


  // 로그인 (중복 닉네임 들어올 시 거부) -> "login"을 listen하고 "login-result"를 emit
  // socket.emit("login",data)에 대한 listener
  // data = {nickname, avatar}
  socket.on("login", async (data) => {
    console.log("data: " + JSON.stringify(data));
    // login result event에 넘겨줄 data, rooms는 lobby에서 active room list를 보여주기 위해 전달
    let resultData = { result: false, msg: "", rooms: [] };

    // 전체 socket 확인해서 중복 nickname있는지 체크
    const sockets = await io.fetchSockets();
    let result = true;
    for (const sock of sockets) {
      if (sock.nickname == data.nickname) {
        result = false;
        break;
      }
    }

    // 로그인 결과를 client에게 전송
    // socket.emit("login-result",resultData)
    // resultData = {result: true/false, msg, rooms}
    if (result) { // 로그인 성공
      // socket.avatar에 이미지 저장하는 부분 아직 안함
      socket.nickname = data.nickname;
      console.log(`login success, socketID: ${socket.id}, nickname: ${socket.nickname}`);
      resultData.result = true;
      resultData.msg = `Hi ${socket.nickname} !`;
      resultData.rooms = rooms;
      socket.emit("login-result", resultData);
    } else { // 로그인 실패
      console.log("login Fail");
      resultData.msg = "Please enter new nickname";
      socket.emit("login-result", resultData);
    }
  });


  // 채팅방 생성 (중복 roomname 들어올 시 거부) -> "create-room"을 listen하고 "create-room-result"를 emit
  // socket.emit("create-room",data)에 대한 listener
  // data= {roomname,isSecret,secretCode,limit}
  socket.on("create-room", async (data) => {
    // console.log('data: ' + JSON.stringify(data));
    let result = true;

    // 현재 rooms array에 같은 이름을 가진 room 존재하는지 체크
    rooms.forEach((room) => {
      if (room.roomname == data.roomname) { // rooms array에 해당 roomname을 가진 방 이미 존재할 경우
        console.log("room create failed, same room name", room.roomname);
        socket.emit("room-create-result", {
          roomname: "",
          result: false,
          msg: "Please enter new room name",
        });
        result = false;
      }
    });
    if (!result) return;

    // room 생성
    let roomdata = {
      roomname: data.roomname,
      memNum: 0,
      memList: [],
      isSecret: data.isSecret,
      secretCode: data.secretCode,
      limit: data.limit,
      adminNick: socket.nickname,
    };
    // 방을 생성하기만 하고 join은 X, 해당 roomdata를 rooms array에 저장
    rooms.push(roomdata);

    // socket.emit("room-create-result",data)
    // data = {roomname,result,msg}
    socket.emit("room-create-result", {
      roomname: data.roomname,
      result: true,
      msg: "room create success!",
    });
  });


  // 현재 해당 방의 인원과 limit 비교해 새 user가 들어갈 수 있는지 체크하는 event listener 아직 안함


  // 비밀방인 경우 해당 방의 비밀코드와 user가 입력한 비밀코드가 일치하는지 체크하는 event listener 아직 안함


  // 방 입장 & 내 방 정보 세팅 & 전체 rooms array update
  // -> "room-in"을 listen, 
  //    "notify-message"를 sockets.in(socket.roomname).emit,
  //    "this-room-info"를 emit, 
  //    "rooms-update"를 broadcast.emit

  //socket.emit("room-in",roomname)에 대한 listener
  socket.on("room-in", (roomname) => {
    // socket을 해당 roomname으로 join시킴
    socket.join(roomname);
    socket.roomname = roomname;

    // 해당 방에 새 user가 방 입장했음 msg 전송
    // sockets.in(socket.roomname).emit("notify-message",msg)
    io.sockets
      .in(socket.roomname)
      .emit("notify-message", `${socket.nickname} joined this room.`);

    // 전체 rooms array update
    roomUpdate();

    // 내 방의 정보를 client에게 전송 (roomname, 현재 인원수 / limit, 멤버 리스트 표시하기 위함)
    // socket.emit("this-room-info",data)
    // data = {room} (room은 내 방 객체)
    let data = { room:getRoomByName(socket.roomname) };
    socket.emit("this-room-info", data);

    // 다른 socket에도 room array에 변화 생겼음을 client에게 전송
    socket.broadcast.emit("room update", rooms);
  });


  //메시지가 오면
  socket.on("chat message", (msg) => {
    data={
      msg:msg,
      name:socket.nickname
    }
    // 해당 방의 모든 socket에게 msg와 nickname 전달
    io.sockets.in(socket.roomname).emit("chat message",data);
    console.log(
      "New chat in room ",
      socket.roomname,
      ": ",
      socket.nickname,
      "says: ",
      msg
    );
  });

});



// static folder 설정
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3383;
server.listen(PORT, () => console.log(`Listening port on : ${PORT}`));





