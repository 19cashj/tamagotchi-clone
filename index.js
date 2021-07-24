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
let selectedIcon = 0;

document.addEventListener('keydown', buttonChoose, false);

class Cloneagotchi {
    constructor(age, sex, growthStage, species, happiness, hunger, weight, discipline, illness, careMistakes) {
        this.age = age;
        this.sex = sex; //0 is male, 1 is female (only that way so the tenary operators work with true/false)
        this.growthStage = growthStage;
        this.species = species;
        this.happiness = happiness;
        this.hunger = hunger;
        this.weight = weight;
        this.discipline = discipline;
        this.illness = illness;
        this.careMistakes = careMistakes;
    }
    async mainAnimate() {
    let randNum = 0//Math.round(Math.random()*3); There will be three different idle animations for the main screen
        switch (this.growthStage) {
            case "infant":
            default:
                if (randNum == 0) {
                    const { mInfantMain0 } = await import('./pixelData.js');
                    const { fInfantMain0 } = await import('./pixelData.js');
                    this.sex ? playAnimation(fInfantMain0, 750):playAnimation(mInfantMain0, 750);
                }
                else if (randNum == 1) {
                    const { mInfantMain1 } = await import('./pixelData.js');
                    const { fInfantMain1 } = await import('./pixelData.js');
                    this.sex ? playAnimation(fInfantMain1, 750):playAnimation(mInfantMain1, 750);
                }
                else if (randNum == 2) {
                    const { mInfantMain2 } = await import('./pixelData.js');
                    const { fInfantMain2 } = await import('./pixelData.js');
                    this.sex ? playAnimation(fInfantMain2, 750):playAnimation(mInfantMain2, 750);
                }
                break;
        }
    }
}

async function stateHandler(state) {
    let mainInterval;
    gameState = state;
    switch (state) {
        case "title":
            playSound("start");
            const { titleAnimation } = await import('./pixelData.js');
            playAnimation(titleAnimation, 500);
            setTimeout(() => {
                canvasClear();
                //if (localStorage.getItem("cloneagotchiData") === null) {
                    stateHandler("beginning");
                //  }
                //else {
                //    loadGame(); //loading not finished yet
                //    stateHandler("main");
                //}
            }, 3150);
            break;
        case "beginning":
            playSound("beep1");
            const { egg } = await import('./pixelData.js');
            const { eggHatchingFemale } = await import('./pixelData.js');
            const { eggHatchingMale } = await import('./pixelData.js');
            drawPreset(egg);
            setTimeout(() => {
                let sexSelector = Math.round(Math.random());
                playSound("panicNoti");
                if(sexSelector == 0) {
                    cloneagotchi = new Cloneagotchi(0, 0, "infant", "na", 0, 0, 0, 0, 0, 0);
                    playAnimation(eggHatchingMale, 750);
                }
                else {
                    cloneagotchi = new Cloneagotchi(0, 1, "infant", "na", 0, 0, 0, 0, 0, 0);
                    playAnimation(eggHatchingFemale, 750);
                }
            }, 10000);
            setTimeout(() => {
                playSound("birth");
                //localStorage.setItem('cloneagotchiData', JSON.stringify(cloneagotchi));
                //console.log(localStorage.getItem('cloneagotchiData'));
                stateHandler("main");
            }, 16800);
            break;
        case "main":
            mainInterval = setInterval(() => {
            cloneagotchi.mainAnimate();
            }, 3001);
            updateTime();
            mainIcon(0);
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
            framePixels = frames[0]
            f = 0;
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
            if (debugDrawMode == true) {
                drawPixelDebug(keyPressed);
            }
            break;
        default:
            //console.log(e.key);
            break;
    }
}
function mainIcon(button) {
    const mainIcons = document.getElementsByClassName("menu");
    switch(button){
        case 0: //called by just loading the main gamestate
            selectedIcon = 0;
            mainIcons[0].classList.remove("grayedOut");
            break;
        case 1: //called from button1
        default:
            playSound("beep2")
            selectedIcon++;
            if(selectedIcon > 7) {
                selectedIcon = 0;
                mainIcons[0].classList.remove("grayedOut");
                mainIcons[7].classList.add("grayedOut");
            }
            if (selectedIcon == 0) {
                mainIcons[0].classList.remove("grayedOut");
                mainIcons[7].classList.add("grayedOut");
            }
            else {
                mainIcons[selectedIcon - 1].classList.add("grayedOut");
                mainIcons[selectedIcon].classList.remove("grayedOut");
            }
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
        case "main":
            mainIcon(1);
            break;
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