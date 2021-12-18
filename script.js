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

let currentZoom = 1;
let minZoom = 0.5;
let maxZoom = 4;
let SCROLL_SENSITIVITY = 0.0005;
let cameraOffset = {
    x: document.querySelector("canvas").width,
    y: document.querySelector("canvas").height
};


const mapCanvas = document.getElementById("mapCanvas");
const ctx = mapCanvas.getContext("2d");

// Function to load the canvas
function makeCanvas() {
    ctx.translate(mapCanvas.width/2, mapCanvas.height/2);
    ctx.scale(currentZoom, currentZoom);
    ctx.translate(-mapCanvas.width/2 + cameraOffset.x, -mapCanvas.height/2 + cameraOffset.y);
    ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

    let navBar = document.querySelector("nav");
    let navBarHeight = navBar.offsetHeight + parseInt(getComputedStyle(navBar).marginTop) + parseInt(getComputedStyle(navBar).marginBottom);

    let canvasWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 10;
    let canvasHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - navBarHeight;


    mapCanvas.setAttribute("width", canvasWidth + "px");
    mapCanvas.setAttribute("height", canvasHeight + "px");

    loadImagesOnCanvas();
}

function loadImagesOnCanvas() {    
    let rescaleRatio = (window.screen.width * window.devicePixelRatio) / 1920;

    var lhc = new Image();
    lhc.src = "pics/LHC.png";
    var lhcHeight = 150 * rescaleRatio;
    var lhcWidth = 105 * rescaleRatio;

    lhc.onload = function () {
        ctx.drawImage(lhc, 0.45 * mapCanvas.width, 0.55 * mapCanvas.height, lhcWidth, lhcHeight);
    };
    
    var adminBlock = new Image();
    adminBlock.src = "pics/admin block and library.png";

    let adminBlockWidth = 286 * rescaleRatio;
    let adminBlockHeight = 225 * rescaleRatio;
    adminBlock.onload = function () {
        ctx.drawImage(adminBlock, 0.46*mapCanvas.width, 0.02*mapCanvas.height, adminBlockWidth, adminBlockHeight);
        adminBlock.classList.add("hoverEffectForBuiliding");
    }
}

// let isDragging = false;

// function updateCurrentZoom(zoomAmount, zoomFactor) {
//     if (!isDragging) {
//         if (zoomAmount) {
//             currentZoom += zoomAmount;
//         }
//         else if (zoomFactor) {
//             currentZoom *= zoomFactor;
//         }

//         currentZoom = Math.min(currentZoom, maxZoom);
//         currentZoom = Math.max(currentZoom, minZoom);
//     }
// }

makeCanvas();

window.addEventListener('resize', () => {
    ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height); // Clear the canvas.
    makeCanvas(); // Draw it all again.
});

// window.addEventListener('wheel', (e) => {
//     updateCurrentZoom(e.deltaY * SCROLL_SENSITIVITY);
// });