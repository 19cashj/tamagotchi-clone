let gameState = "none";
let cloneagotchi;
let startSeconds;
let currentSeconds;
let timeDifference;
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
let canvasPixels = [];
let shadedPixels = [];
let shadedPixelsNums = [];
let selectedPixel = 0;
let prevPixel = 0;
let debugDrawMode = false;
let animateInterval;
let selectedIcon = 0;
let subMenuSelection = 1;
let lightsOn;
let rapidSnackCheck = false;

document.addEventListener('keydown', buttonChoose, false);

class Cloneagotchi {
    constructor(age, sex, growthStage, species, happiness, hunger, weight, discipline, illness, waste, careMistakes) {
        this.age = age;
        this.sex = sex; //0 is male, 1 is female (only that way so the tenary operators work with true/false)
        this.growthStage = growthStage;
        this.species = species;
        this.happiness = happiness;
        this.hunger = hunger;
        this.weight = weight;
        this.discipline = discipline;
        this.illness = illness;
        this.waste = waste;
        this.careMistakes = careMistakes;
    }
    async mainAnimate() {
        let randNum = 0//Math.round(Math.random()*3); There will be three different idle animations for the main screen
        let appendedAnimation = undefined;
        if (this.illness == 1) {
            const { illnessPreset } = await import('./pixelData.js');
            appendedAnimation = illnessPreset;
        }
        if (lightsOn) {
            switch (this.growthStage) {
                case "infant":
                default:
                    if (randNum == 0) {
                        const { mInfantMain0 } = await import('./pixelData.js');
                        const { fInfantMain0 } = await import('./pixelData.js');
                        this.sex ? playAnimation(fInfantMain0, 750, true, appendedAnimation):playAnimation(mInfantMain0, 750, true, appendedAnimation);
                    }
                    else if (randNum == 1) {
                        const { mInfantMain1 } = await import('./pixelData.js');
                        const { fInfantMain1 } = await import('./pixelData.js');
                        this.sex ? playAnimation(fInfantMain1, 750, true, appendedAnimation):playAnimation(mInfantMain1, 750, true, appendedAnimation);
                    }
                    else if (randNum == 2) {
                        const { mInfantMain2 } = await import('./pixelData.js');
                        const { fInfantMain2 } = await import('./pixelData.js');
                        this.sex ? playAnimation(fInfantMain2, 750, true, appendedAnimation):playAnimation(mInfantMain2, 750, true, appendedAnimation);
                    }
                    break;
            }
        }
        else {
            ctx.fillStyle = "black";
            ctx.fillRect(0,0,500,500);
        }
    }

    timeAwayChange() { //Method to change certain stats depending on how long the user was away
        console.log(timeDifference);
        timeDifference = 0;
    }

    checkCare() {
        if (this.happiness == 0) {
            this.cry();
            this.careMistakes++;
        }
        if (this.hunger == 0) {
            this.cry();
            this.careMistakes++;
        }
        //Add more checks, such as if owner let the cloneagotchi be sick for too long without medicine, or if owner left the lights on at night etc
    }

    randomStatChange() {
        //Method to randomly make the cloneagotchi sick, change happiness etc. Should change the rate for bad things depending on growth stage (Younger = more bad things)
    }

    exercised(won) {
        let randNum = Math.round(Math.random()*4);
        if(this.weight > 5) {
            this.weight--;
        }
        if(won) {
            if (this.happiness < 4) {
                this.happiness++;
            }
        }
        if (randNum == 2) {
            this.hunger--;
        }
    }

    feed(food) {
        let snackCheckTimeout;
        if (food == "meal") {
            if (this.hunger < 4) {
                this.hunger++;
            }
            this.weight++;
        }
        else if (food == "snack") {
            if (this.happiness < 4) {
                this.happiness++;
            }
            this.weight+=2;
            if (rapidSnackCheck) {
                this.illness = 1;
                //this.careMistakes++;
                clearTimeout(snackCheckTimeout);
            }
            rapidSnackCheck = true;
            snackCheckTimeout = setTimeout(() => {
                rapidSnackCheck = false;
            }, 10000);
        }
    }

    cry() {
        const mainIcons = document.getElementsByClassName("menu");
        mainIcons[7].classList.remove("grayedOut");
        playSound('beep4');
        setTimeout(() => {
            mainIcons[7].classList.add("grayedOut");
        }, 250);
        setTimeout(() => {
            playSound('beep4');
            mainIcons[7].classList.remove("grayedOut");
            setTimeout(() => {
                mainIcons[7].classList.add("grayedOut");
            }, 250);
        }, 500);
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
                else {
                    loadGame(); //loading not finished yet
                    stateHandler("main");
                }
            }, 3150);
            break;
        case "beginning":
            localStorage.clear();
            playSound("beep1");
            const { egg } = await import('./pixelData.js');
            const { eggHatchingFemale } = await import('./pixelData.js');
            const { eggHatchingMale } = await import('./pixelData.js');
            drawPreset(egg);
            setTimeout(() => {
                let sexSelector = Math.round(Math.random());
                playSound("panicNoti");
                if(sexSelector == 0) {
                    cloneagotchi = new Cloneagotchi(0, 0, "infant", "na", 4, 4, 5, 0, 0, 0, 0);
                    playAnimation(eggHatchingMale, 750);
                }
                else {
                    cloneagotchi = new Cloneagotchi(0, 1, "infant", "na", 4, 4, 5, 0, 0, 0, 0);
                    playAnimation(eggHatchingFemale, 750);
                }
            }, 10000);
            setTimeout(() => {
                const startDate = new Date();
                startSeconds = Math.round(startDate.getTime()/1000);
                playSound("birth");
                localStorage.setItem('startSeconds', JSON.stringify(startSeconds));
                localStorage.setItem('cloneagotchiData', JSON.stringify(cloneagotchi));
                console.log(localStorage.getItem('startSeconds'));
                console.log(localStorage.getItem('cloneagotchiData'));
                stateHandler("main");
            }, 16800);
            break;
        case "main":
            clearInterval(animateInterval);
            mainIcon(0);
            cloneagotchi.mainAnimate();
            saveGame();
            break;
        case "foodMenu":
            clearInterval(animateInterval);
            canvasClear();
            const { menuSelectPreset1 } = await import('./pixelData.js');
            drawPreset(menuSelectPreset1);
            subMenuSelection = 1;
            ctx.fillStyle = 'black';
            ctx.font = '50px Lucida Console';
            ctx.fillText('Meal', 50, 75);
            ctx.fillText('Snack', 50, 125);
            break;
        case "lightSwitch":
            lightsOn = !lightsOn;
            stateHandler("main");
            break;
        case "gameMenu":
            console.log("Game Menu goes here");
            stateHandler("main");
            break;
        case "medicine":
            if (cloneagotchi.illness == 1) {
                playSound('regularNoti');
                cloneagotchi.illness = 0;
            }
            else {
                playSound('beep3');
            }
            stateHandler("main");
            break;
        case "plunger":
            if (cloneagotchi.waste > 0) {
                playSound('regularNoti');
                cloneagotchi.waste = 0;
            }
            else {
                playSound('beep3');
            }
            stateHandler("main");
            break;
        case "statMenu":
            console.log("Stat Menu goes here");
            stateHandler("main");
            break;
        case "discipline":
            console.log("You tried to discipline your cloneagotchi");
            stateHandler("main");
            break;
        case "moodMenu":
            console.log("Mood Menu goes here");
            stateHandler("main");
            break;
    }
}

function saveGame() {
    localStorage.setItem('cloneagotchiData', JSON.stringify(cloneagotchi));
    localStorage.setItem('previousSeconds', JSON.stringify(currentSeconds));
    localStorage.setItem('lightsOn', JSON.stringify(lightsOn));
}

function loadGame() {
    const cloneagotchiData = JSON.parse(localStorage.getItem('cloneagotchiData'));
    cloneagotchi = new Cloneagotchi(cloneagotchiData.age, cloneagotchiData.sex, cloneagotchiData.growthStage, cloneagotchiData.species, cloneagotchiData.happiness, cloneagotchiData.hunger, cloneagotchiData.weight, cloneagotchiData.discipline, cloneagotchiData.illness, cloneagotchiData.waste, cloneagotchiData.careMistakes);
    startSeconds = parseInt(localStorage.getItem('startSeconds'));
    const previousSeconds = parseInt(localStorage.getItem('previousSeconds'));
    timeDifference = currentSeconds - previousSeconds;
    lightsOn = JSON.parse(localStorage.getItem('lightsOn'));
    cloneagotchi.timeAwayChange();
}

function updateTime() {
    setInterval(() => {
        let currentTime = new Date();
        currentSeconds = Math.round(currentTime.getTime()/1000);
        document.getElementById("headTimer").textContent = currentSeconds;
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

function drawPreset(imported, clear=true) {
    if (clear){
        canvasClear();
    }
    for (i=0;i<imported.length;i++) {
        canvasDraw(imported[i]);
    }
}

function playAnimation(frames, speed, loop=false, appendedFrame) {
    let framePixels = frames[0]
    let f = 0;
    animateInterval = setInterval(() => {
        canvasClear();
        for (i=0;i<framePixels.length;i++) {
            canvasDraw(framePixels[i]);
        }
        if (appendedFrame != undefined) {
            let appendedPixels = appendedFrame[0];
            for (i=0;i<appendedPixels.length;i++) {
                canvasDraw(appendedPixels[i]);
            }
        }
        f++;
        framePixels = frames[f]
        if (f == frames.length) {
            if (loop == false) {
                clearInterval(animateInterval);
            }
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
            for (i=0;i<8;i++){
                mainIcons[i].classList.add("grayedOut");
            }
            mainIcons[0].classList.remove("grayedOut");
            selectedIcon = 0;
            break;
        case 1: //called from button1
        default:
            playSound("beep2");
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

async function button1() {
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
        case "foodMenu":
            playSound("beep2");
            const { menuSelectPreset1 } = await import('./pixelData.js');
            const { menuSelectPreset2 } = await import('./pixelData.js');
            subMenuSelection++
            if (subMenuSelection < 3) {
                if (subMenuSelection == 1) {
                    drawPreset(menuSelectPreset1);
                }
                else if (subMenuSelection == 2) {
                    drawPreset(menuSelectPreset2);
                }
            }
            else {
                subMenuSelection = 1;
                drawPreset(menuSelectPreset1);
            }
            ctx.fillStyle = 'black';
            ctx.font = '50px Lucida Console';
            ctx.fillText('Meal', 50, 75);
            ctx.fillText('Snack', 50, 125);
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
            case "main":
                switch (selectedIcon) {
                    case 0:
                        playSound("beep1");
                        stateHandler("foodMenu");
                        break;
                    case 1:
                        playSound("beep1");
                        stateHandler("lightSwitch");
                        break;
                    case 2:
                        playSound("beep1");
                        stateHandler("gameMenu");
                        break;
                    case 3:
                        stateHandler("medicine");
                        break;
                    case 4:
                        stateHandler("plunger");
                        break;
                    case 5:
                        playSound("beep1");
                        stateHandler("statMenu");
                        break;
                    case 6:
                        playSound("beep1");
                        stateHandler("discipline");
                        break;
                    case 7:
                        playSound("beep1");
                        stateHandler("moodMenu");
                        break;
                }
            break; //This one line of code fixed the most annoying problem with the submenu
            case "foodMenu":
                if(subMenuSelection == 1) { //Give a meal
                    playSound("beep1");
                    cloneagotchi.feed("meal");
                    //Add feeding animation
                    subMenuSelection = 1;
                    stateHandler("main");
                }
                else if (subMenuSelection == 2) { //Give a snack
                    playSound("beep1");
                    cloneagotchi.feed("snack");
                    //Add feeding animation
                    subMenuSelection = 1;
                    stateHandler("main");
                }
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
        case "foodMenu":
            subMenuSelection = 0;
            playSound("beep3");
            stateHandler("main");
            break;
    }
}

canvasInit();
updateTime();