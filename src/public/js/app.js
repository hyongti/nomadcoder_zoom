const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone() {
  console.log("backend done"); // 백엔드에서 호출되는데 프론트엔드에서 실행될 함수(?!?!?!?).
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // WebSocket에서는 string을 send했는데..
  // socket.io는 객체도 전송할 수 있고, 원하는 event(ex. enter_room)도 전송할 수 있음..
  // 심지어 함수도 보낼 수 있음!!!!!!!!!!!!!
  socket.emit("enter_room", input.value, backendDone);
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
