const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // WebSocket에서는 string을 send했는데.. socket.io는 객체도 전송할 수 있고, 원하는 event(ex. enter_room)도 전송할 수 있음..
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("server is done"); // 세 번째 인자로 넘겨주는 함수가 server.js에서 호출되면 프론트엔드에서 실행됨;;
  });
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
