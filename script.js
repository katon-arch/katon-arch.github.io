/* =====================================
   GLOBAL VARIABLES
===================================== */

let video = document.getElementById("video");
let gallery = document.getElementById("gallery");
let selectGallery = document.getElementById("selectGallery");

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
.catch(err=>{
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

let interval = setInterval(()=>{

sessionTime--;

let minutes = Math.floor(sessionTime/60);
let seconds = sessionTime%60;

document.getElementById("timer").innerText =
String(minutes).padStart(2,'0') + ":" +
String(seconds).padStart(2,'0');

if(sessionTime <= 0){

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
   GO TO SELECT SCREEN
===================================== */

function goSelect(){

if(photos.length === 0){
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

if(selectedPhotos.length >= 4){
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

let wrappers=document.querySelectorAll(".photoWrapper");

wrappers.forEach(w=>{

let img=w.querySelector("img");
let number=w.querySelector(".photoNumber");

let id=img.dataset.id;

let index = selectedPhotos.indexOf(id);

if(index !== -1){

number.innerText=index+1;
number.style.display="block";

img.classList.add("selected");

}else{

number.style.display="none";
img.classList.remove("selected");

}

});

}


function clearSelection(){

selectedPhotos=[];
updateNumbers();

}


/* =====================================
   FRAME SELECTOR
===================================== */
function renderFrames(){
let frameSelector = document.getElementById("frameSelector");
frameSelector.innerHTML="";
frames.forEach(frame=>{
let img=document.createElement("img");
img.src=frame;
img.addEventListener("click",()=>{
selectedFrame = frame;
document.querySelectorAll("#frameSelector img")
.forEach(f=>f.classList.remove("frameSelected"));
img.classList.add("frameSelected");
previewStrip(); // update preview otomatis
});

frameSelector.appendChild(img);
});
}

/* =====================================
   PHOTOSTRIP GENERATOR
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

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

ctx.clearRect(0,0,canvas.width,canvas.height);

let loaded = 0;

selectedPhotos.forEach((id,index)=>{

let img = new Image();

img.onload = function(){

ctx.drawImage(img, 95, 200, 1000, 600)
ctx.drawImage(img, 95, 875, 1000, 600)
ctx.drawImage(img, 95, 1500, 1000, 600)
ctx.drawImage(img, 95, 2160, 1000, 600);

loaded++;

if(loaded === 4){

drawFrame();

}

}

img.src = photos[id];

});

}


/* =====================================
   ADD FRAME OVERLAY
===================================== */

function addFrame(){

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let frame = new Image();

frame.onload = function(){

ctx.drawImage(frame,0,0,1200,3600);

let data = canvas.toDataURL("image/png");

let link = document.getElementById("downloadBtn");

link.href = data;
link.style.display = "inline-block";

};

frame.src = selectedFrame;

}

/* ===== Preview Frame ======*/
function previewStrip(){

if(selectedPhotos.length !== 4){
alert("Select 4 photos");
return;
}

if(!selectedFrame){
alert("Select frame first");
return;
}

let canvas=document.getElementById("previewCanvas");
let ctx=canvas.getContext("2d");

ctx.clearRect(0,0,canvas.width,canvas.height);

let loaded=0;

selectedPhotos.forEach((id,index)=>{

let img=new Image();

img.onload=function(){

ctx.drawImage(img,0,index*225,300,225);

loaded++;

if(loaded===4){
addPreviewFrame();
}

}

img.src=photos[id];

});

}

function addPreviewFrame(){

let canvas=document.getElementById("previewCanvas");
let ctx=canvas.getContext("2d");

let frame=new Image();

frame.onload=function(){

ctx.drawImage(frame,0,0,300,900);

}

frame.src=selectedFrame;

}

function drawFrame(){

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let frame = new Image();

frame.onload = function(){

ctx.drawImage(frame,0,0,1200,3600);

let data = canvas.toDataURL("image/png");

let link = document.getElementById("downloadBtn");

link.href = data;
link.style.display = "inline-block";

}

frame.src = selectedFrame;

}
