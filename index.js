let gameState = "start";
let currentTime = new Date();
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
let canvasPixels = [];
let shadedPixels = [];
let shadedPixelsNums = [];
let selectedPixel = 0;
let prevPixel = 0;
let debugDrawMode = false;

document.addEventListener('keydown', buttonChoose, false);

function updateTime() {
    setInterval(() => {
        currentTime = new Date();
        document.getElementById("headTimer").textContent = currentTime;
    }, 1000);
}

function canvasDraw(i, temp) {
    ctx.fillStyle = `black`;
    if (temp != true) {
        shadedPixels.push([canvasPixels[i][0], canvasPixels[i][1]]);
        shadedPixelsNums.push(i);
    }
    ctx.fillRect(canvasPixels[i][0], canvasPixels[i][1], 10, 10);
}

function canvasErase(i, temp) {
    ctx.fillStyle = `rgb(172, 228, 191)`;
    ctx.fillRect(canvasPixels[i][0], canvasPixels[i][1], 10, 10);
    if (temp != true) {
        shadedPixels.splice(shadedPixels.indexOf([canvasPixels[i]]), 1);
        shadedPixelsNums.splice(shadedPixelsNums.indexOf(i), 1);
    }
}

function canvasInit() {
    for (i=0, x=0, y=0; i<=618; i++) {
        if (x > canvas.width) {
            y +=10;
            x = 0;
        }
        else {
            let currentPixel = [x,y];
            canvasPixels.push(currentPixel);
            x+=10;
        }
    }
}

function drawPixelDebug(key) {
    debugDrawMode = true;
    function pixelMove(change) {
        prevPixel = selectedPixel;
        selectedPixel += change;
            if (shadedPixelsNums.includes(prevPixel)) {
                canvasDraw(prevPixel, true);
            }
            else {
                canvasErase(prevPixel, true);
            }
    }
    switch(key) {
        case "w":
            pixelMove(-31)
            break;
        case "s":
            pixelMove(31);
            break;
        case "d":
            pixelMove(1);
            break;
        case "a":
            pixelMove(-1);
            break;
        case "Shift":
            if (shadedPixelsNums.includes(selectedPixel)) {
                canvasErase(selectedPixel, false);
            }
            else {
                canvasDraw(selectedPixel, false);
            }
            break;
        case "Escape":
            debugDrawMode = false;
            clearInterval(flashInterval);
            break;
        default: //default (no key) will just start the interval
            flashInterval = setInterval(() => {
                canvasDraw(selectedPixel, true);
                setTimeout(() => {
                    canvasErase(selectedPixel, true);
                }, 300);
            }, 600);
            break;
    }
}

function buttonChoose(e) {
    let keyPressed = e.key;
    switch (keyPressed) {
        case "z":
            button1();
            break;
        case "x":
            button2();
            break;
        case "c":
            button3();
            break;
        case "w":
        case "a":
        case "s":
        case "d":
        case "Shift":
        case "Escape":
            if (debugDrawMode = true) {
                drawPixelDebug(keyPressed);
            }
            break;
        default:
            //console.log(e.key);
            break;
    }
}

function button1(gameState) {
    const button = document.getElementById("button1")
    button.classList.add("buttonActive");
    setTimeout(() => {
        button.classList.remove("buttonActive");
    }, 100);
    switch (gameState) {
        case "start":
        default:
            break;
    }
}

function button2(gameState) {
    const button = document.getElementById("button2")
    button.classList.add("buttonActive");
    setTimeout(() => {
        button.classList.remove("buttonActive");
    }, 100);
    switch (gameState) {
        case "start":
        default:
            break;
    }
}

function button3(gameState) {
    const button = document.getElementById("button3")
    button.classList.add("buttonActive");
    setTimeout(() => {
        button.classList.remove("buttonActive");
    }, 100);
    switch (gameState) {
        case "start":
        default:
            break;
    }
}

canvasInit();
updateTime();