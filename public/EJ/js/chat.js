let roomTitle=document.getElementById('roomInfo_name')
let roomMemNum=document.getElementById('roomInfo_num')
let roomMemList=document.getElementById('memList')
let roomList=document.getElementById('roomList')
let lobbyRooms=document.getElementById('lobby_rooms')


// 내가 입장한 방의 정보 받아서 표시
socket.on('room info',(data)=>{
  //전체 rooms array중에 내가 입장한 room 객체를 검색
  let thisRoom={};
  data.rooms.forEach(room=>{
    if(room.roomname==data.roomname)
    thisRoom=room
  })

    // 내 방의 이름, 현재 인원수/limit, 멤버 리스트 표시 
  roomTitle.innerText=thisRoom.roomname
  roomMemNum.innerText=thisRoom.memNum+' / '+thisRoom.limit
  thisRoom.memList.forEach(member => {
    let item = document.createElement('li');
    item.textContent = member;
    roomMemList.appendChild(item);
  });

  // 전체 active한 방의 리스트 표시
  data.rooms.forEach(room => {
    let item = document.createElement('li');
    item.textContent = room.roomname+"    "+room.memNum+' / '+room.limit;
    roomList.appendChild(item);
  });
})

// rooms array에 변화 생겼을 때 실시간으로 변화 반영
// currentArea가 chat / lobby에 따라 다르게 처리
// currentArea == chat이면 내 방의 정보와 전체 active한 방 리스트 갱신
// currentArea == lobby이면 나는 아직 방에 입장하지 않은 상태, 전체 active한 방 리스트만 갱신
socket.on('room update',rooms=>{
  console.log('room update called')
  if(currentArea=='chat'){ 
    // rooms array에서 내 방 찾기
    let thisRoom={};
    roomname=roomTitle.innerText // html이 갖고있던 roomTitle로 현재 이 방의 roomname 구함
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
    
    // 전체 avtive한 채팅방 리스트 갱신 ( 방이름, 멤버수/인원제한 )
    roomList.innerHTML=""
    rooms.forEach(room => {
      let item = document.createElement('li');
      item.textContent = room.roomname+"    "+room.memNum+' / '+room.limit;
      roomList.appendChild(item);
    });

  }else if(currentArea=="lobby"){
    lobby_roomUpdate(rooms)
  }
})

let messages = document.getElementById('messages');
let messageForm = document.getElementById('messageForm');
let messageInput = document.getElementById('messageInput');

//msg 전송버튼 누르면
messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (messageInput.value) {
      socket.emit('chat message', messageInput.value);
      messageInput.value = '';
    }
  });

// 서버로부터 chat 받음
socket.on('chat message', function(data) {
  let item = document.createElement('li');
  item.textContent = `${data.name} : ${data.msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// 서버로부터 notify 받음
socket.on('notify message', function(msg) {
  let item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});