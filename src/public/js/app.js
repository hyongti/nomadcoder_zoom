const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName = "";

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${input.value}`);
  });
}

function showRoom() {
  // 백엔드에서 호출되는데 프론트엔드에서 실행될 함수(?!?!?!?).
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // WebSocket에서는 string을 send했는데..
  // socket.io는 객체도 전송할 수 있고, 원하는 event(ex. enter_room)도 전송할 수 있음..
  // 심지어 함수도 보낼 수 있음!!!!!!!!!!!!!
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => addMessage("Someone joined!"));

socket.on("bye", () => {
  addMessage("Someone left T_T");
});

socket.on("new_message", addMessage);