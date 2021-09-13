// frontEnd
const socket = new WebSocket(`ws://${window.location.host}`); // 여기서의 socket은 서버로의 연결

// socket에도 event가 있음!
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

setTimeout(() => {
  socket.send("hello from the Browser");
}, 1000);
