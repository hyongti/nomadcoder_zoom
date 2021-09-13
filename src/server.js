// backEnd
import express from "express";
// import WebSocket from "ws";
import SocketIO from "socket.io";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
// const wss = new WebSocket.Server({ server });
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket["nickname"] = "anonymous";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

// const onSocketClose = () => {
//   console.log("Disconnected from the Browser ❌");
// };

// const sockets = [];
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "anonymous";
//   console.log("Connected to Browser ✅");
//   socket.on("close", onSocketClose);
//   socket.on("message", (message) => {
//     const msgObject = JSON.parse(message);
//     switch (msgObject.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname} : ${msgObject.payload}`)
//         );
//       case "nickname":
//         socket["nickname"] = msgObject.payload;
//     }
//   });
// });

httpServer.listen(3000, handleListen);
