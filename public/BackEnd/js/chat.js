let roomTitle=document.getElementById('roomInfo_name')
let roomMemNum=document.getElementById('roomInfo_num')
let roomMemList=document.getElementById('memList')
let roomList=document.getElementById('roomList')
let lobbyRooms=document.getElementById('lobby_rooms')





// 서버로부터 내가 입장한 방의 정보 받아서 표시 -> "this-room-info"를 listen
// socket.emit("this-room-info",thisRoom)에 대한 listener
socket.on('this-room-info',(thisRoom)=>{
    // 내 방의 이름, 현재 인원수/limit, 멤버 리스트 표시 
  roomTitle.innerText=thisRoom.roomname
  roomMemNum.innerText=thisRoom.memNum+' / '+thisRoom.limit
  thisRoom.memList.forEach(member => {
    let item = document.createElement('li');
    item.textContent = member;
    roomMemList.appendChild(item);
  });

})



// 서버의 rooms array에 변화 생겼을 때 실시간으로 변화 반영
// currentArea가 chat / lobby에 따라 다르게 처리
// currentArea == chat이면 내 방의 정보 갱신
// currentArea == lobby이면 나는 아직 방에 입장하지 않은 상태, 전체 active한 방 리스트만 갱신

// socket.broadcast.emit("rooms-update",rooms)에 대한 listener
// rooms는 전체 active한 rooms array
socket.on('rooms-update',rooms=>{
  console.log('room update called')
  if(currentArea=='chat'){ // 내 방의 정보 갱신
    // rooms array에서 내 방 찾기
    let thisRoom={};
    roomname=roomTitle.innerText // chat page html이 갖고있던 roomTitle로 현재 이 방의 roomname 구함
    rooms.forEach(room=>{
      if(room.roomname==roomname){
        thisRoom=room
        console.log(thisRoom)

        // 자기 방의 이름, 멤버수/인원제한, 멤버 리스트 갱신
        roomTitle.innerText=thisRoom.roomname
        roomMemNum.innerText=thisRoom.memNum+' / '+thisRoom.limit
        roomMemList.innerHTML=""
        thisRoom.memList.forEach(member=>{
          let item = document.createElement('li');
          item.textContent=member
          roomMemList.appendChild(item)
        })
      }
    });
    
    // 이 기능은 삭제 예정
    // // 전체 avtive한 채팅방 리스트 갱신 ( 방이름, 멤버수/인원제한 )
    // roomList.innerHTML=""
    // rooms.forEach(room => {
    //   let item = document.createElement('li');
    //   item.textContent = room.roomname+"    "+room.memNum+' / '+room.limit;
    //   roomList.appendChild(item);
    // });

  }else if(currentArea=="lobby"){ // active한 방 리스트 갱신
    lobby_roomUpdate(rooms);
  }
})


let messages = document.getElementById('messages');
let messageForm = document.getElementById('messageForm');
let messageInput = document.getElementById('messageInput');


// chat 전송하기 -> "chat-message"를 emit
// socket.emit("chat-message",msg)
messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (messageInput.value) {
      socket.emit('chat-message', messageInput.value);
      messageInput.value = '';
    }
  });


// 서버로부터 chat 받음 -> "chat-message"를 listen
// sockets.in(socket.roomname).emit("chat-message",data)에 대한 listener
// data = {name,msg}
socket.on('chat-message', data=>{
  let item = document.createElement('li');
  item.textContent = `${data.name} : ${data.msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});


// 서버로부터 notify msg 받음 -> "notify-message"를 listen
// sockets.in(socket.roomname).emit("notify-message",msg)에 대한 listener
socket.on('notify-message', function(msg) {
  let item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});



// 방 나가기 버튼 onClick event listener -> "room-out"을 emit하고 lobbyArea로 이동, chatArea의 멤버리스트와 chat 내용들 지우기
function clickRoomOut(){
  var input=confirm("want to leave this room?");
  if(input){
    socket.emit("room-out")


    document.getElementById('chatArea').className="d-none"
    document.getElementById('lobbyArea').className=""
    currentArea="lobby"

    roomMemList.innerHTML=""
    messages.innerHTML=""

    // lobby의 active한 room list update
    lobby_roomUpdate(data.rooms)
  }
}

