let gameState = "none";
let cloneagotchi;
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

class Cloneagotchi {
    constructor(age, growthStage, species, happiness, hunger, weight, discipline, illness, careMistakes) {
        this.age = age;
        this.growthStage = growthStage;
        this.species = species;
        this.happiness = happiness;
        this.hunger = hunger;
        this.weight = weight;
        this.discipline = discipline;
        this.illness = illness;
        this.careMistakes = careMistakes;
    }
}

async function stateHandler(state) {
    gameState = state;
    switch (state) {
        case "title":
            playSound("start");
            const { titleAnimation } = await import('./pixelData.js');
            playAnimation(titleAnimation, 500);
            setTimeout(() => {
                canvasClear();
                if (localStorage.getItem("cloneagotchiData") === null) {
                    stateHandler("beginning");
                  }
            }, 3150);
            break;
        case "beginning":
            playSound("beep1");
            const { egg } = await import('./pixelData.js');
            const { eggHatching } = await import('./pixelData.js');
            drawPreset(egg);
            setTimeout(() => {
                playSound("panicNoti");
                playAnimation(eggHatching, 750);
            }, 10000);
            setTimeout(() => {
                playSound("birth");
                cloneagotchi = new Cloneagotchi(0, "egg", "na", 0, 0, 0, 0, 0, 0);
                localStorage.setItem('cloneagotchiData', JSON.stringify(cloneagotchi));
                console.log(localStorage.getItem('cloneagotchiData'));
                stateHandler("main");
            }, 17000);
            break;
        case "main":
            break;
        case "foodMenu":
            break;
        case "gameMenu":
            break;
        case "statMenu":
            break;
        case "moodMenu":
            break;
    }
}

function saveGame() {
    //save the time etc
    localStorage.setItem('cloneagotchiData', JSON.stringify(cloneagotchi));
}

function loadGame() {
    
}

function updateTime() {
    setInterval(() => {
        currentTime = new Date();
        document.getElementById("headTimer").textContent = currentTime;
    }, 1000);
}

function playSound(sound) {
    let audio = new Audio()
    audio.src = `sound/${sound}.wav`;
    audio.play();
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

function canvasClear() {
    ctx.fillStyle = `rgb(172, 228, 191)`;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    shadedPixels = [];
    shadedPixelsNums = [];
}

function drawPreset(imported) {
    canvasClear();
    for (i=0;i<imported.length;i++) {
        canvasDraw(imported[i]);
    }
}

function playAnimation(frames, speed) {
    let framePixels = frames[0]
    let f = 0;
    animateInterval = setInterval(() => {
        canvasClear();
        for (i=0;i<framePixels.length;i++) {
            canvasDraw(framePixels[i]);
        }
        f++;
        framePixels = frames[f]
        if (f == frames.length) { //Animation will stop at the end of the frames, could add option to loop
            clearInterval(animateInterval);
        }
    }, speed);
}

function canvasInit() {
    for (let i=0, x=0, y=0; i<=618; i++) {
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

function eraseDataDebug() {
    localStorage.clear();
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

function button1() {
    let state = gameState;
    const button = document.getElementById("button1")
    button.classList.add("buttonActive");
    setTimeout(() => {
        button.classList.remove("buttonActive");
    }, 100);
    switch (state) {
        case "title":
        default:
            break;
    }
}

function button2() {
    let state = gameState;
    const button = document.getElementById("button2")
    button.classList.add("buttonActive");
    setTimeout(() => {
        button.classList.remove("buttonActive");
    }, 100);
    switch (state) {
        case "none":
            stateHandler("title");
            break;
        default:
            break;
    }
}

function button3() {
    let state = gameState;
    const button = document.getElementById("button3")
    button.classList.add("buttonActive");
    setTimeout(() => {
        button.classList.remove("buttonActive");
    }, 100);
    switch (state) {
        case "title":
        default:
            break;
    }
}

canvasInit();
updateTime();