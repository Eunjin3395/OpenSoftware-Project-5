//secret 여부 클릭 시 secretCode 받는 창 띄우기
const radios = document.querySelectorAll('input[type=radio][name="isSecret"]');
radios.forEach(radio=>radio.addEventListener('change',()=>{
  if(radio.value=='Y'){
    document.getElementById('secretCodeArea').className=""
  }else{
    document.getElementById('secretCodeArea').className="d-none"
    document.getElementById('createSecretCode').value=""
  }
}

))

// 방 만들기
let roomCreateForm = document.getElementById('roomCreateForm');
roomCreateForm.addEventListener('submit', function(e) {
  e.preventDefault();
  let roomTitleInput = document.getElementById('createRoomTitle').value;
  let isSecretYN=document.querySelector('input[type=radio][name=isSecret]:checked').value
  let secretCode=""

  // 비밀방인 경우
  if(isSecretYN=="Y"){
    secretCode=document.getElementById('createSecretCode').value;
  }

  let roomLimit = document.getElementById('createRoomLimit').value;

  if(roomTitleInput==""){
    alert("Enter room title")
    return;
  }
  if(isSecretYN=="Y"&&secretCode==""){ //비밀방으로 한다고 했는데 비밀코드 입력 안한 경우
    alert("Enter secret code")
    return;
  }
  if(roomLimit>99||roomLimit<0){ // 인원제한의 입력 정상적인지 체크
    alert("Enter valid room limit (0~99)")
    return;
  }
  socket.emit('createRoom',{
    roomname:roomTitleInput,
    isSecret:isSecretYN,
    secretCode:secretCode,
    limit:roomLimit
  })
});

// 방 생성 결과 & 방 입장(방장이 생성후 바로 입장하므로 limit과 비밀코드 체크하지 않음)
socket.on('room_create_result',(data)=>{
  if(data.result){
    alert(data.msg)
    room_in(data.roomname)
  }else{
    alert(data.msg)
  }
})

// 입력받은 roomname을 가진 채팅방으로 입장 & 화면 전환 및 currentArea 변경
function room_in(roomname){
  console.log('room_in function',roomname)
  document.getElementById('lobbyArea').className="d-none"
  document.getElementById('chatArea').className=""
  socket.emit("room in",roomname)
  currentArea='chat'
}

// lobby의 room list를 update하는 함수 (입장하기 onClick eventlistenr 포함)
function lobby_roomUpdate(rooms){
  lobbyRooms.innerHTML=""
  rooms.forEach(room => {
    let item = document.createElement('li');
    item.textContent = `${room.roomname}    ${room.memNum} / ${room.limit}   입장하기`;
    item.onclick=function(){
      console.log('onClick roomname: ',room.roomname)

      // room in 시키기 전에 입장할 room의 인원제한 체크해서 내가 들어갈 수 있는지 체크 필요
      // room in 시키기 전에 입장할 room이 비밀방이라면 비밀코드 체크 절차 필요

      room_in(room.roomname)
    }  
      
    lobbyRooms.appendChild(item);
  })
}