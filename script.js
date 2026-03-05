const video = document.getElementById("video")

let photos = []

const countdownEl = document.getElementById("countdown")

/* CAMERA */

navigator.mediaDevices.getUserMedia({video:true})
.then(stream=>{
video.srcObject = stream
})


/* COUNTDOWN */

function startCountdown(){

if(photos.length >= 4) return

let count = 3

countdownEl.innerText = count

let timer = setInterval(()=>{

count--

if(count > 0){

countdownEl.innerText = count

}else{

countdownEl.innerText = ""

clearInterval(timer)

takePhoto()

}

},1000)

}


/* TAKE PHOTO */

function takePhoto(){

const canvas = document.createElement("canvas")

canvas.width = video.videoWidth
canvas.height = video.videoHeight

const ctx = canvas.getContext("2d")

ctx.drawImage(video,0,0)

const img = canvas.toDataURL("image/png")

photos.push(img)

updatePreview()

updateCounter()

}


/* COUNTER */

function updateCounter(){

document.getElementById("photoCount").innerText =
photos.length + " / 4 Photos"

}


/* PREVIEW */

function updatePreview(){

const canvas = document.getElementById("previewCanvas")

const ctx = canvas.getContext("2d")

ctx.clearRect(0,0,canvas.width,canvas.height)

const scale = canvas.width / 1200

const positions = [
{ x:95.2, y:222.9 },
{ x:95.2, y:871.4 },
{ x:95.2, y:1520 },
{ x:95.2, y:2168.6 }
]

photos.forEach((photo,index)=>{

const img = new Image()

img.onload = function(){

const pos = positions[index]

ctx.drawImage(
img,
pos.x * scale,
pos.y * scale,
1000 * scale,
600 * scale
)

}

img.src = photo

})

}


/* RETAKE */

function retakeAll(){

photos = []

updatePreview()

updateCounter()

}


/* GENERATE */

function generateStrip(){

if(photos.length !== 4){
alert("Take 4 photos first")
return
}

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const positions = [
{ x:95.2, y:222.9 },
{ x:95.2, y:871.4 },
{ x:95.2, y:1520 },
{ x:95.2, y:2168.6 }
]

photos.forEach((photo,index)=>{

const img = new Image()

img.onload = function(){

const pos = positions[index]

ctx.drawImage(img,pos.x,pos.y,1000,600)

if(index === 3){
downloadImage()
}

}

img.src = photo

})

}


/* DOWNLOAD */

function downloadImage(){

const canvas = document.getElementById("canvas")

const link = document.getElementById("downloadLink")

link.href = canvas.toDataURL("image/png")

link.click()

}
