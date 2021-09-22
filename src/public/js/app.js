const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

async function getMedia(deviceId) {
  // deviceId가 없을 때 호출(cameras를 만들기 전)
  const initialConstraints = {
    audio: true,
    video: { facingMode: "user" },
  };
  // deviceId가 있을 때 호출
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstraints
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
}

function handleMuteClick() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}

function handleCameraClick() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
}

async function handelCameraChange() {
  await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handelCameraChange);

// Welcome Form (join a room)

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function initCall() {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
}

async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  await initCall();
  socket.emit("join_room", input.value);
  roomName = input.value;
  input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket code

// 먼저 접속해있던 브라우저에서 실행
socket.on("welcome", async () => {
  const offer = await myPeerConnection.createOffer();
  // 내 로컬 description을 설정하고 서버로 이 description을 보냄
  myPeerConnection.setLocalDescription(offer);
  console.log("sent the offer");
  socket.emit("offer", offer, roomName);
});

// 나중에 들어온 브라우저에서 실행
socket.on("offer", async (offer) => {
  // 나중에 들어온 브라우저에서 offer 이벤트와 함께 상대방 로컬 description을 받으면 원격 description을 설정하고,
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  // 상대방 offer에 대한 내 대답을 내 로컬 description로 설정한 뒤에 서버에 다시 보냄
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
});

// 다시 먼저 접속해있던 브라우저에서 실행
socket.on("answer", (answer) => {
  // 내가 보낸 offer에 대한 answer가 오면 원격 description을 answer로 설정
  myPeerConnection.setRemoteDescription(answer);
});

// RTC code
function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}
