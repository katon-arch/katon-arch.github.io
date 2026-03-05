/* =====================================
   GLOBAL VARIABLES
===================================== */

const video = document.getElementById("video");
const gallery = document.getElementById("gallery");
const selectGallery = document.getElementById("selectGallery");

let photos = [];
let selectedPhotos = [];
let selectedFrame = null;

let sessionTime = 300;

const frames = [
"frames/frame1.png",
"frames/frame2.png"
];


/* =====================================
   CAMERA SETUP
===================================== */

navigator.mediaDevices.getUserMedia({video:true})
.then(stream=>{
video.srcObject = stream;
})
.catch(()=>{
alert("Camera access denied");
});


/* =====================================
   SESSION TIMER
===================================== */

function startSession(){

document.getElementById("startScreen").style.display="none";
document.getElementById("booth").style.display="block";

startTimer();

}

function startTimer(){

const timer = document.getElementById("timer");

let interval = setInterval(()=>{

sessionTime--;

let minutes = Math.floor(sessionTime/60);
let seconds = sessionTime%60;

timer.innerText =
String(minutes).padStart(2,'0')+":"+
String(seconds).padStart(2,'0');

if(sessionTime<=0){

clearInterval(interval);
alert("Session End");

location.reload();

}

},1000);

}


/* =====================================
   CAMERA ACTIONS
===================================== */

function takePhoto(){

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

function retakeAll(){

if(!confirm("Delete all photos?")) return;

photos = [];
gallery.innerHTML="";

}


/* =====================================
   NAVIGATION
===================================== */

function goSelect(){

if(photos.length===0){
alert("Take some photos first");
return;
}

document.getElementById("booth").style.display="none";
document.getElementById("selectScreen").style.display="block";

renderSelectGallery();
renderFrames();

}


/* =====================================
   PHOTO SELECTION
===================================== */

function renderSelectGallery(){

selectGallery.innerHTML="";
selectedPhotos=[];

photos.forEach((photo,index)=>{

let wrapper=document.createElement("div");
wrapper.className="photoWrapper";

let img=document.createElement("img");
img.src=photo;
img.dataset.id=index;

let number=document.createElement("div");
number.className="photoNumber";

wrapper.appendChild(img);
wrapper.appendChild(number);

img.addEventListener("click",()=>{

let id = img.dataset.id;

if(selectedPhotos.includes(id)){

selectedPhotos = selectedPhotos.filter(p=>p!==id);

}else{

if(selectedPhotos.length>=4){
alert("Maximum 4 photos");
return;
}

selectedPhotos.push(id);

}

updateNumbers();

});

selectGallery.appendChild(wrapper);

});

}

function updateNumbers(){

document.querySelectorAll(".photoWrapper").forEach(wrapper=>{

let img = wrapper.querySelector("img");
let number = wrapper.querySelector(".photoNumber");

let id = img.dataset.id;
let index = selectedPhotos.indexOf(id);

if(index!==-1){

number.innerText=index+1;
number.style.display="block";

img.classList.add("selected");

}else{

number.style.display="none";
img.classList.remove("selected");

}

});

/* update preview otomatis */

if(selectedPhotos.length===4 && selectedFrame){
previewStrip();
}else{
clearPreview();
}

}

function clearSelection(){

selectedPhotos=[];
updateNumbers();

}


/* =====================================
   FRAME SELECTOR
===================================== */

function renderFrames(){

let frameSelector=document.getElementById("frameSelector");

frameSelector.innerHTML="";

frames.forEach(frame=>{

let img=document.createElement("img");
img.src=frame;

img.addEventListener("click",()=>{

selectedFrame = frame;

document.querySelectorAll("#frameSelector img")
.forEach(f=>f.classList.remove("frameSelected"));

img.classList.add("frameSelected");

/* update preview */

if(selectedPhotos.length===4){
previewStrip();
}

});

frameSelector.appendChild(img);

});

}


/* =====================================
   PREVIEW SYSTEM
===================================== */

function previewStrip(){

let canvas = document.getElementById("previewCanvas");
let ctx = canvas.getContext("2d");

ctx.clearRect(0,0,canvas.width,canvas.height);

const scale = canvas.width / 1200;

const positions = [
{ x:95.2, y:222.9 },
{ x:95.2, y:871.4 },
{ x:95.2, y:1520 },
{ x:95.2, y:2168.6 }
];

let loaded = 0;

selectedPhotos.forEach((id,index)=>{

let img = new Image();

img.onload = function(){

let pos = positions[index];

ctx.drawImage(
img,
pos.x * scale,
pos.y * scale,
1000 * scale,
600 * scale
);

loaded++;

if(loaded === 4){
drawPreviewFrame();
}

}

img.src = photos[id];

});

}
function drawPreviewFrame(){

let canvas=document.getElementById("previewCanvas");
let ctx=canvas.getContext("2d");

let frame=new Image();

frame.onload=function(){

ctx.drawImage(frame,0,0,canvas.width,canvas.height);

}

frame.src=selectedFrame;

}

function clearPreview(){

let canvas=document.getElementById("previewCanvas");
let ctx=canvas.getContext("2d");

ctx.clearRect(0,0,canvas.width,canvas.height);

}


/* =====================================
   FINAL PHOTOSTRIP GENERATOR
===================================== */

function generateStrip(){

if(selectedPhotos.length !== 4){
alert("Select 4 photos");
return;
}

if(!selectedFrame){
alert("Select frame first");
return;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.clearRect(0,0,canvas.width,canvas.height);

const positions = [
{ x:95.2, y:222.9 },
{ x:95.2, y:871.4 },
{ x:95.2, y:1520 },
{ x:95.2, y:2168.6 }
];

let loaded = 0;

selectedPhotos.forEach((id,index)=>{

const img = new Image();

img.onload = function(){

const pos = positions[index];

ctx.drawImage(
img,
pos.x,
pos.y,
1000,
600
);

loaded++;

if(loaded === 4){
drawFrame();
}

};

img.src = photos[id];

});

}

function drawFrame(){

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const frame = new Image();

frame.onload = function(){

ctx.drawImage(frame,0,0,canvas.width,canvas.height);

const data = canvas.toDataURL("image/png");

const link = document.getElementById("downloadBtn");

link.href = data;
link.style.display = "inline-block";

};

frame.src = selectedFrame;

}
