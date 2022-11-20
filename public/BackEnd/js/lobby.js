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


// 방 만들기 -> "create-room"을 emit
// socket.emit("create-room", data)
// data ={roomname,isSecret,secretCode,limit}
let roomCreateForm = document.getElementById('roomCreateForm');
roomCreateForm.addEventListener('submit', function(e) {
  e.preventDefault();
  let roomTitleInput = document.getElementById('createRoomTitle').value;
  let isSecretYN=document.querySelector('input[type=radio][name=isSecret]:checked').value
  let secretCode=""
  let roomLimit = document.getElementById('createRoomLimit').value;

  if(isSecretYN=="Y"){ // 비밀방인 경우 비밀코드 지정
    secretCode=document.getElementById('createSecretCode').value;
  }
  if(roomTitleInput==""){ // 방 이름 입력 안한 경우
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

  // 모든 입력 정상적인 경우, 서버로 data 전송
  socket.emit('create-room',{
    roomname:roomTitleInput,
    isSecret:isSecretYN,
    secretCode:secretCode,
    limit:roomLimit
  })
});


// 방 생성 결과 & 방 입장 -> "room-create-result"를 listen하고 room_in 호출
// socket.emit("room-create-result",data)에 대한 listener
// data = {roomname,result,msg}
socket.on('room-create-result',(data)=>{
  if(data.result){ // 방 생성 성공 시 room_in 함수 호출
    alert(data.msg)
    // 방장이 방 생성 후 바로 입장하므로 limit과 비밀코드 체크하지 않고 room_in 호출
    room_in(data.roomname)
  }else{ // 방 생성 실패
    alert(data.msg)
  }
})


// 입력받은 roomname을 가진 채팅방으로 입장 -> "room-in"을 emit하고 chatArea 보여주기 및 currentArea 변경
// socket.emit("room-in",roomname)
function room_in(roomname){
  document.getElementById('lobbyArea').className="d-none"
  document.getElementById('chatArea').className=""
  socket.emit("room-in",roomname)
  currentArea='chat'
}


// rooms array 전달 받아 lobby의 room list를 update하는 함수, 입장하기 onClick eventlistenr 포함
function lobby_roomUpdate(rooms){
  lobbyRooms.innerHTML=""
  rooms.forEach(room => {
    let item = document.createElement('li');
    item.textContent = `${room.roomname}    ${room.memNum} / ${room.limit}   입장하기`;
    item.onclick=function(){
      console.log('onClick roomname: ',room.roomname)

      // room in 시키기 전에 입장할 room의 인원제한 체크해서 내가 들어갈 수 있는지 체크하는 event emit 필요 -> 아직 안함
      // room in 시키기 전에 입장할 room이 비밀방이라면 비밀코드 체크하는 event emit 필요 -> 아직 안함

      room_in(room.roomname)
    }  
      
    lobbyRooms.appendChild(item);
  })
}