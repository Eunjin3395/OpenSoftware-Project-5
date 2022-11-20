// Avatar를 선택
function selAvatar(id){
  var list=document.querySelectorAll("#avata > li")
  list.forEach(element => {
    if(element.id==id){
      if(element.className=="selected"){
        element.className=""
      }else{
        element.className="selected"
      }
    }else{
      element.className=""
    }
  });

}

//선택한 Avatar의 id를 리턴, 선택하지 않은 경우 X 리턴
function checkAvatar(){
  var list=document.querySelectorAll("#avata > li")
  var retValue="X"
  list.forEach(element => {
    if(element.className=="selected"){
      retValue=element.id
    }
  });
  return retValue
}

// 로그인 시도
var loginForm = document.getElementById('loginForm');
var nicknameInput = document.getElementById('nickname');
loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (nicknameInput.value) {
    let val=checkAvatar()
    if(val!="X"){
      socket.emit('login',{
        nickname:nicknameInput.value,
        avatar:val        
      })
    }else{ // avatar를 선택하지 않고 submit 누른 경우
      alert("Select Avatar")
    }
  }else{ // nickname을 입력하지 않고 submit 누른 경우
    alert("Input nickname")
  }
});

// 서버로부터 로그인 결과 받음
socket.on('login result',(data)=>{
  if(!data.result) //로그인 실패
    alert(data.msg);
  else{
    alert(data.msg) // 로그인 성공
    document.getElementById('loginArea').className="d-none"
    document.getElementById('lobbyArea').className=""
    currentArea="lobby"
    lobby_roomUpdate(data.rooms)
  }
})
