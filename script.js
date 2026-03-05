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

document.getElementById("generateBtn").onclick = generateStrip;

function generateStrip(){

if(photos.length < 4){
alert("Take at least 4 photos first");
return;
}

let canvas = document.getElementById("stripCanvas");
let ctx = canvas.getContext("2d");

let selectedPhotos = photos.slice(-4);

let imagesLoaded = 0;

ctx.clearRect(0,0,canvas.width,canvas.height);

selectedPhotos.forEach((src,index)=>{

let img = new Image();

img.onload = function(){

ctx.drawImage(img,0,index*900,1200,900);

imagesLoaded++;

if(imagesLoaded === 4){
addFrame();
}

}

img.src = src;

});

}

function addFrame(){

let canvas = document.getElementById("stripCanvas");
let ctx = canvas.getContext("2d");

let frame = new Image();

frame.onload = function(){

ctx.drawImage(frame,0,0,1200,3600);

let dataURL = canvas.toDataURL("image/png");

let downloadBtn = document.getElementById("downloadBtn");

downloadBtn.href = dataURL;
downloadBtn.style.display="block";
downloadBtn.innerText="DOWNLOAD PHOTO";

}

frame.src = "frames/frame1.png";

}

function addFrame(){

let canvas = document.getElementById("stripCanvas");
let ctx = canvas.getContext("2d");

let frame = new Image();

frame.onload = function(){

ctx.drawImage(frame,0,0,1200,3600);

let dataURL = canvas.toDataURL("image/png");

let downloadBtn = document.getElementById("downloadBtn");

downloadBtn.href = dataURL;
downloadBtn.style.display="block";
downloadBtn.innerText="DOWNLOAD PHOTO";

}

frame.src = "frames/frame1.png";

}
