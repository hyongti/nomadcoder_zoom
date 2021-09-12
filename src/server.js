// backEnd
import express from "express";
import WebSocket from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public")); // 이 라인이 public 폴더를 유저에게 공개
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);

// http와 ws를 동시에 작동(?)시킬 수 있음.
const server = http.createServer(app);
// http 서버 위에 webSocket 서버를 만듦.
const wss = new WebSocket.Server({ server });

server.listen(3000, handleListen);
