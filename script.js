// function for controlling day/night mode button
function changeMode(){
    var element = document.querySelector("canvas");
    element.classList.toggle("dark-mode")

    if (document.getElementById("theme").getAttribute("src") == "pics/DarkThemeIcon.png") {
        document.getElementById("theme").src = "pics/sun.png";
    } else {
        document.getElementById("theme").src = "pics/DarkThemeIcon.png";
    }
}

// The following section contains the code for loading and functioning of the map canvas

const mapCanvas = document.getElementById("mapCanvas");
const ctx = mapCanvas.getContext("2d");

let currentZoom = 1;
let minZoom = 0.3;
let maxZoom = 3;
let SCROLL_SENSITIVITY = 0.0005;
let cameraOffset = {
    // x: document.querySelector("canvas").width,
    // y: document.querySelector("canvas").height
    x: 0, y:0
};

const imgName = [
    "lhc", "adminBlock"
];
const imgSource = [
    "pics/LHC.png", "pics/admin block and library.png"
];
const imgSize = [
    [105, 150], [286, 225]
];
const imgPosRatio = [
    [0.45, 0.55], [0.46, 0.02]
];
const imgObjects = [];
var imagesLeftToLoad = imgName.length;

function loadAllImages() {
    var imgLoaded = []
    for (var i=0; i<imgName.length; i++) {
        imgObjects[i] = new Image();
        imgObjects[i].onload = function() {
            imgLoaded[i] = true;
        };
        imgObjects[i].src = imgSource[i];
        imgObjects[i].alt = imgName[i];
        makeCanvas();
    }
}

// Function to load the canvas
function makeCanvas() {
    if (--imagesLeftToLoad > 0) return;
    
    if (imagesLeftToLoad == 0) {
        document.getElementById("loader").style.display = "none";
        document.querySelector("iframe").style.display = "block";
        mapCanvas.style.display = "block";
        imagesLeftToLoad--;
    }

    let navBar = document.querySelector("nav");
    let navBarHeight = navBar.offsetHeight + parseInt(getComputedStyle(navBar).marginTop) + parseInt(getComputedStyle(navBar).marginBottom);

    let canvasWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 10;
    let canvasHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - navBarHeight;


    mapCanvas.setAttribute("width", canvasWidth + "px");
    mapCanvas.setAttribute("height", canvasHeight + "px");

    loadImagesOnCanvas();
}

function loadImagesOnCanvas() {
    ctx.translate(mapCanvas.width/2, mapCanvas.height/2);
    ctx.scale(currentZoom, currentZoom);
    ctx.translate(-mapCanvas.width/2 + cameraOffset.x, -mapCanvas.height/2 + cameraOffset.y);
    ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

    ctx.fillStyle = 'yellow';
    ctx.fillRect(0.20 * mapCanvas.width, 0.55 * mapCanvas.height, 100, 100);

    ctx.fillStyle = 'green';
    ctx.font = '20px calibri';
    ctx.fillText("Hostels", 0.20 * mapCanvas.width + 20, 0.55 * mapCanvas.height + 50);

    let rescaleRatio = (window.screen.width * window.devicePixelRatio) / 1920;

    for (var i=0; i<imgName.length; i++) {
        ctx.drawImage(
            imgObjects[i],
            imgPosRatio[i][0] * mapCanvas.width, imgPosRatio[i][1] * mapCanvas.height,
            imgSize[i][0] * rescaleRatio, imgSize[i][1] * rescaleRatio
        );
    }

    // var lhcHeight = 150 * rescaleRatio;
    // var lhcWidth = 105 * rescaleRatio;

    // lhc.onload = function () {
    //     ctx.drawImage(lhc, 0.45 * mapCanvas.width, 0.55 * mapCanvas.height, lhcWidth, lhcHeight);
    //     lhc.addEventListener("click", function() {
    //         lhc.classList.toggle("buildingSelected");
    //     });
    // };
    
    // let adminBlockWidth = 286 * rescaleRatio;
    // let adminBlockHeight = 225 * rescaleRatio;
    // adminBlock.onload = function () {
    //     ctx.drawImage(adminBlock, 0.46*mapCanvas.width, 0.02*mapCanvas.height, adminBlockWidth, adminBlockHeight);
        // adminBlock.classList.add("hoverEffectForBuiliding");
    // }

    // adminBlock.addEventListener("click", function () {
    //     adminBlock.classList.toggle("builidingSelected");
    // });
}

// Gets the relevant location from a mouse or single touch event
function getEventLocation(event) {
    if (event.touches && event.touches.length == 1) {
        return {x:event.touches[0].clientX, y: event.touches[0].clientY}
    }
    else if (event.clientX && event.clientY) {
        return { x: event.clientX, y: event.clientY};
    }
}

let isDragging = false;
let draggingStartPos = {x: 0, y: 0};
let initialPinchDistance = null;

function onPointerDown(event) {
    isDragging = true
    draggingStartPos.x = getEventLocation(event).x/currentZoom - cameraOffset.x;
    draggingStartPos.y = getEventLocation(event).y/currentZoom - cameraOffset.y;
}

function onPointerUp(e) {
    isDragging = false;
    initialPinchDistance = null;
}

function onPointerMove(event) {
    if (isDragging) {
        cameraOffset.x = getEventLocation(event).x/currentZoom - draggingStartPos.x;
        cameraOffset.y = getEventLocation(event).y/currentZoom - draggingStartPos.y;
        makeCanvas();
    }
}

function handlePinch(event) {
    event.preventDefault()
    
    let touch1 = {x: event.touches[0].clientX, y: event.touches[0].clientY};
    let touch2 = {x: event.touches[1].clientX, y: event.touches[1].clientY};
    
    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2;
    
    if (initialPinchDistance == null) {
        initialPinchDistance = currentDistance;
    }
    else {
        updateCurrentZoom(null, currentDistance/initialPinchDistance);
    }
}

function handleTouch(event, singleTouchHandler) {
    if ( event.touches.length == 1 ) {
        singleTouchHandler(event)
    }
    else if (event.type == "touchmove" && event.touches.length == 2) {
        isDragging = false
        handlePinch(event)
    }
}

function updateCurrentZoom(zoomAmount, zoomFactor) {
    if (!isDragging) {
        if (zoomAmount) {
            currentZoom += zoomAmount;
        }
        else if (zoomFactor) {
            currentZoom *= zoomFactor;
        }

        currentZoom = Math.min(currentZoom, maxZoom);
        currentZoom = Math.max(currentZoom, minZoom);
        console.log("Current Zoom: ", currentZoom);
        makeCanvas();
    }
}

window.addEventListener('resize', () => {
    // ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height); // Clear the canvas.
    makeCanvas(); // Draw it all again.
});

mapCanvas.addEventListener('mousedown', onPointerDown);
mapCanvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown));

mapCanvas.addEventListener('mouseup', onPointerUp);
mapCanvas.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp));

mapCanvas.addEventListener('mousemove', onPointerMove);
mapCanvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove));

mapCanvas.addEventListener('mouseout', onPointerUp);

mapCanvas.addEventListener('wheel', (e) => updateCurrentZoom(e.deltaY * SCROLL_SENSITIVITY));

mapCanvas.onwheel = function(event){
    event.preventDefault();
};

mapCanvas.onmousewheel = function(event){
    event.preventDefault();
};

loadAllImages();
makeCanvas();

// small bug 
// images load only after the canvas is zoomed-in/out or dragged 
