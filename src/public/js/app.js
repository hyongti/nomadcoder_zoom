// frontEnd
const socket = new WebSocket(`ws://${window.location.host}`); // 여기서의 socket은 서버로의 연결

const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

// socket에도 event가 있음!
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

// 아래처럼 string을 send하면 백엔드가 구분할 수 없으니,
// type과 payload를 가지는 JSON을 보내자. => 근데 text의 형태로 보내야 함!
// (백엔드에서 자바스크립트를 쓸지 다른 언어를 쓸지 모르니까 자바스크립트 객체로 보내면 안 됨..)
function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  //   socket.send({
  //     type: "message",
  //     payload: input.value, // => 이걸 서버에서 받아서 type을 확인해야함.
  //   });
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  //   socket.send({
  //     type: "nickname",
  //     payload: input.value,
  //   });
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
