let video = document.getElementById("video");
let captureBtn = document.getElementById("captureBtn");
let gallery = document.getElementById("gallery");
let timerDisplay = document.getElementById("timer");

let photos = [];
let sessionTime = 300;

navigator.mediaDevices.getUserMedia({video:true})
.then(stream=>{
video.srcObject = stream;
});

function startSession(){
document.getElementById("startScreen").style.display="none";
document.getElementById("cameraScreen").style.display="block";

startTimer();
}

captureBtn.onclick = function(){

let canvas = document.createElement("canvas");
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

let ctx = canvas.getContext("2d");
ctx.drawImage(video,0,0);

let img = canvas.toDataURL("image/png");

photos.push(img);

let image = document.createElement("img");
image.src = img;

gallery.appendChild(image);
}

document.getElementById("retakeBtn").onclick = function(){
photos = [];
gallery.innerHTML="";
}

function startTimer(){

let interval = setInterval(()=>{

sessionTime--;

let minutes = Math.floor(sessionTime/60);
let seconds = sessionTime%60;

timerDisplay.innerText =
String(minutes).padStart(2,'0') + ":" +
String(seconds).padStart(2,'0');

if(sessionTime <= 0){
clearInterval(interval);
alert("Session End");
location.reload();
}

},1000)

}
