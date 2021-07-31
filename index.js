let gameState = "none";
let cloneagotchi;
let startSeconds;
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
let timeInterval;
let selectedIcon = 0;
let subMenuSelection = 1;
let lightsOn = true;
let rapidSnackCheck = false;
let statLock = false;
let lightLock = false;
let foodClock;
let happinessClock;
let lightsClock = 0;
let foodWasteInc = 0;
let gameDecision;
let gameCount = 0;
let gameWinCount = 0;
let foodTimeout;

document.addEventListener('keydown', buttonChoose, false);

class Cloneagotchi {
    constructor(age, sex, growthStage, species, happiness, hunger, weight, discipline, illness, waste, naughty, careMistakes) {
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
        this.naughty = naughty;
        this.careMistakes = careMistakes;
    }
    async mainAnimate() {
        let randNum = 0//Math.round(Math.random()*3); There will be three different idle animations for the main screen
        let appendedAnimation = [];
        if (this.illness == 1) {
            const { illnessPreset } = await import('./pixelData.js');
            appendedAnimation.push(illnessPreset);
        } //change this system so multiple appends can work (illness and waste)
        if (this.waste > 0) {
            switch(this.waste){
                case 1:
                    const { waste1 } = await import('./pixelData.js');
                    appendedAnimation.push(waste1);
                    break;
                case 2:
                    const { waste2 } = await import('./pixelData.js');
                    appendedAnimation.push(waste2);
                    break;
                case 3:
                    const { waste3 } = await import('./pixelData.js');
                    appendedAnimation.push(waste3);
                    break;
            }
        }
        if (lightsOn == true) {
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

    async gameAnimate(game=undefined, condition=undefined) {
        if (game == undefined) { //First frame of the main animation will be drawn at the start of a game
            if (condition == undefined) {
                switch (this.growthStage) {
                    case "infant":
                    default:
                        const { mInfantMain0 } = await import('./pixelData.js');
                        const { fInfantMain0 } = await import('./pixelData.js');
                        canvasClear();
                        this.sex ? drawPreset(fInfantMain0[0]):drawPreset(mInfantMain0[0]);
                }
            }
            else if (condition == "win") {
                switch (this.growthStage) {
                    case "infant":
                    default:
                        const { mInfantHappy } = await import('./pixelData.js');
                        const { fInfantHappy } = await import('./pixelData.js');
                        canvasClear();
                        this.sex ? drawPreset(fInfantHappy[0]):drawPreset(mInfantHappy[0]);
                }
            }
            else if (condition == "lose") {
                switch (this.growthStage) {
                    case "infant":
                    default:
                        const { mInfantSad } = await import('./pixelData.js');
                        const { fInfantSad } = await import('./pixelData.js');
                        canvasClear();
                        this.sex ? drawPreset(fInfantSad[0]):drawPreset(mInfantSad[0]);
                }
            }
        }

        else if (game == "lr") {
            switch (this.growthStage) {
                case "infant":
                default:
                    const { mInfantMain0 } = await import('./pixelData.js');
                    const { fInfantMain0 } = await import('./pixelData.js');
                    canvasClear();
                    if (condition == "right") {
                        this.sex ? drawPreset(fInfantMain0[1]):drawPreset(mInfantMain0[1]);
                    }
                    else if (condition == "left") {
                        this.sex ? drawPreset(fInfantMain0[2]):drawPreset(mInfantMain0[2]);
                    }
            }
        }

        else if (game == "hl") {
            switch (this.growthStage) {
                case "infant":
                default:
                    const { mInfantMain0 } = await import('./pixelData.js');
                    const { fInfantMain0 } = await import('./pixelData.js');
                    canvasClear();
                    if (condition == "higher") {
                        this.sex ? drawPreset(fInfantMain0[1]):drawPreset(mInfantMain0[1]);
                    }
                    else if (condition == "lower") {
                        this.sex ? drawPreset(fInfantMain0[2]):drawPreset(mInfantMain0[2]);
                    }
            }
        }
    }

    timeAwayChange() { //Method to change certain stats depending on how long the user was away
        console.log(timeDifference);
        let timeAwayExecutions = Math.floor(timeDifference / 360);
        if (timeAwayExecutions >= 1) {
            for (i=0;i<timeAwayExecutions;i++) {
                this.randomStatChange(true);
            }
        }
        this.guaranteedStatChange(true);
        this.checkCare();
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
        if (this.waste > 2) {
            this.cry();
            this.careMistakes++;
        }
        if (this.illness == 2) {
            this.cry();
            this.careMistakes++;
        }
        if (this.illness == 3) {
            this.die();
        }
        if (cloneagotchi.careMistakes >= 5) { //Need to find the right amount of caremistakes to result in death, needs to be fair because the user can't see caremistakes
            this.die();
        }
        //Add more checks, if owner left the lights on at night for too long etc
    }

    async die() {
        lightsOn = true;
        clearInterval(timeInterval);
        clearInterval(animateInterval);
        clearTimeout(foodTimeout);
        localStorage.clear();
        canvasClear();
        stateHandler("locked");
        playSound("badNoti");
        const { dead } = await import('./pixelData.js');
        drawPreset(dead[0]);
        playAnimation(dead, 2000, false);
    }

    //Rates for stat changes are a WIP, they are faster right now for testing purposes

    scriptedStatChange() {
        let gameSecondsTotal = currentSeconds - startSeconds;
            if (gameSecondsTotal >= 86400 && gameSecondsTotal <= 172800) {
                if (cloneagotchi.growthStage == "infant") {
                    playSound('birth');
                    cloneagotchi.growthStage = "toddler";
                    cloneagotchi.age = 1;
                }
            }
        //Stat changes that will happen no matter what (growthStage changes, predefined events etc)
    }

    guaranteedStatChange(timeAway=false) {
        if (timeAway == false) {
            switch(cloneagotchi.growthStage) {
                default:
                    if (foodClock == 240) {
                        foodClock = 0;
                        if (cloneagotchi.hunger > 0) {
                            cloneagotchi.hunger -= 1
                        }
                    }
                    if (happinessClock == 240) {
                        happinessClock = 0;
                        if (cloneagotchi.happiness > 0) {
                            cloneagotchi.hunger -= 1
                        }
                    }
                break;
                case "infant":
                    if (foodClock == 120) {
                        foodClock = 0;
                        if (cloneagotchi.hunger > 0) {
                            cloneagotchi.hunger --
                        }
                        if (cloneagotchi.hunger == 1) {
                            this.cry();
                        }
                    }
                    if (happinessClock == 120) {
                        happinessClock = 0;
                        if (cloneagotchi.happiness > 0) {
                            cloneagotchi.happiness --
                        }
                        if (cloneagotchi.happiness == 1) {
                            this.cry();
                        }
                    }
                break;
            }
        }

        else if (timeAway == true) {
        let difference;
            switch(cloneagotchi.growthStage) {
                default:
                    difference = timeDifference / 43200;
                    break;
                case "infant":
                    difference = timeDifference / 21600;
                    break;
            }
            if (difference >= 1) {
                foodClock = 0;
                happinessClock = 0;
                if (cloneagotchi.hunger > 0) {
                    cloneagotchi.hunger - Math.floor(difference);
                }

                if (cloneagotchi.happiness > 0) {
                    cloneagotchi.happiness - Math.floor(difference);
                }
            }
        }
    }

    randomStatChange(timeAway=false) {
        //statLock (global variable) will lock stat changes to prevent spam (even though it would be rare to get the same event back to back quickly)
        let randNum;
        let illnessCeil = [35,40];
        let wasteCeil = [45,50];
        switch(cloneagotchi.growthStage) {
            case "infant":
                randNum = Math.round(Math.random() *5000);
                illnessCeil[1] = 100;
                wasteCeil[0] = 105;
                wasteCeil[1] = 155;
            default:
                randNum = Math.round(Math.random() *10000);
                break;
        }
        if (statLock == false) {
            if (timeAway == false) {
                if (randNum > 0 && randNum < 10) { //Random naughty event, for chance to increase discipline (user has 10 seconds to discipline after a fake cry)
                    cloneagotchi.naughty = true
                    this.cry();
                    statLock = true;
                    setTimeout(() => {
                        cloneagotchi.naughty = false;
                    }, 10000);
                    setTimeout(() => {
                        statLock = false;
                    }, 30000);
                }
            }
            if (randNum > 10 && randNum < 15) {
                if (cloneagotchi.hunger > 0) {
                    cloneagotchi.hunger--;
                    foodClock = 0;
                }
                if (timeAway == false) {
                    statLock = true;
                    setTimeout(() => {
                        statLock = false;
                    }, 30000);
                    if (cloneagotchi.hunger == 1) {
                        this.cry();
                    }
                    this.checkCare();
                }
            }
            if (randNum > 25 && randNum < 30) {
                if (cloneagotchi.happiness > 0) {
                    cloneagotchi.happiness--;
                    happinessClock = 0;
                }
                if (timeAway == false) {
                    statLock = true;
                    setTimeout(() => {
                        statLock = false;
                    }, 30000);
                    if (cloneagotchi.happiness == 1) {
                        this.cry();
                    }
                }
                this.checkCare();
            }
            if (randNum > illnessCeil[0] && randNum < illnessCeil[1]) {
                if (timeAway = true) {
                    cloneagotchi.illness = 1;
                }
                if (timeAway == false) {
                    cloneagotchi.illness++;
                    if (gameState == "main") {
                        clearInterval(animateInterval);
                        canvasClear();
                        this.mainAnimate();
                    }
                    statLock = true;
                    setTimeout(() => {
                        statLock = false;
                    }, 30000);
                    this.checkCare();
                }
            }
            if (randNum > wasteCeil[0] && randNum < wasteCeil[1]) {
                if (cloneagotchi.waste < 4) {
                    cloneagotchi.waste++;
                }
                if (timeAway == false) {
                    if (gameState == "main") {
                        clearInterval(animateInterval);
                        canvasClear();
                        this.mainAnimate();
                    }
                    if (cloneagotchi.waste == 2) {
                        this.cry();
                    }
                    statLock = true;
                    setTimeout(() => {
                        statLock = false;
                    }, 30000);
                    this.checkCare();
                }
            }
        }
        //Add a check for lights on at night, give user 30 seconds to turn off the lights or they get a care mistake
    }

    exercised(won) {
        happinessClock = 0;
        if(this.weight > 5) {
            this.weight--;
        }
        if(won) {
            if (this.happiness < 4) {
                this.happiness++;
            }
        }
    }

    async feed(food) {
        let snackCheckTimeout;
        if (lightsOn == true) {
            switch (this.growthStage) {
                case "infant":
                default:
                    const { mInfantEating } = await import('./pixelData.js');
                    const { fInfantEating } = await import('./pixelData.js');
                    this.sex ? playAnimation(fInfantEating, 250, true):playAnimation(mInfantEating, 250, true);
                    break;
            }
        }
        if (food == "meal") {
            if (this.hunger < 4) {
                this.hunger++;
            }
            this.weight++;
            foodClock = 0;
        }
        else if (food == "snack") {
            if (this.happiness < 4) {
                this.happiness++;
            }
            this.weight+=2;
            happinessClock = 0;
            if (rapidSnackCheck) {
                this.illness++;
                if (gameState == "main") {
                    stateHandler("main");
                }
                playSound("badNoti2")
                this.careMistakes++;
                this.checkCare();
                clearTimeout(snackCheckTimeout);
            }
            rapidSnackCheck = true;
            snackCheckTimeout = setTimeout(() => {
                rapidSnackCheck = false;
            }, 10000);
        }
        foodWasteInc++;
        if (foodWasteInc == 2) {
            cloneagotchi.waste++;
            if (cloneagotchi.waste == 2) {
                cloneagotchi.cry();
            }
            foodWasteInc = 0;
        }
    }

    moodCheck() {
        let moodScore = 4;
        let mood;
        switch (this.happiness) {
            case 0:
                moodScore -= 4;
                break;
            case 1:
                moodScore -= 3;
                break;
            case 2:
                moodScore -= 2;
                break;
            case 3:
                break;
            case 4:
                moodScore += 1;
                break;
        }
        switch (this.hunger) {
            case 0:
                moodScore -= 2;
                break;
            case 1:
                moodScore -= 1;
                break;
            case 2:
            case 3:
            case 4:
                break;
        }
        switch (this.illness) {
            case 0:
                break;
            case 1:
                moodScore -= 2;
                break;
            case 2:
                moodScore -= 3;
        }
        switch (this.waste) {
            case 0:
                break;
            case 1:
                moodScore -= 1;
                break;
            case 2:
            case 3:
                moodScore -= 2;
                break;
        }
        switch(moodScore) {
            case -8:
            case -7:
            case -6:
            case -5:
            case -4:
                mood = "scared";
                break;
            case -3:
            case -2:
                mood = "sad";
                break;
            case -1:
                mood = "angry";
                break;
            case 0:
                mood = "terrible";
                break;
            case 1:
                mood = "bad";
                break;
            case 2:
                mood = "average";
                break;
            case 3:
                mood = "good";
                break;
            case 4:
                mood = "great";
                break;
            case 5:
            case 6:
                mood = "fantastic";
                break;
        }
        return mood;
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

async function stateHandler(state,extraInput=undefined) {
    gameState = state;
    let higherOrLower;
    const { menuSelectPreset1 } = await import('./pixelData.js');
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
                    loadGame();
                    updateTime();
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
                    cloneagotchi = new Cloneagotchi(0, 0, "infant", "na", 4, 4, 5, 0, 0, 0, false, 0);
                    playAnimation(eggHatchingMale, 750);
                }
                else {
                    cloneagotchi = new Cloneagotchi(0, 1, "infant", "na", 4, 4, 5, 0, 0, 0, false, 0);
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
                updateTime();
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
            clearInterval(animateInterval);
            canvasClear();
            drawPreset(menuSelectPreset1);
            subMenuSelection = 1;
            ctx.fillStyle = 'black';
            ctx.font = '25px Lucida Console';
            ctx.fillText('Left/Right', 50, 75);
            ctx.fillText('Higher/Lower', 50, 125);
            break;
        case "game-leftright":
            if (extraInput == undefined) {
                clearInterval(animateInterval);
                canvasClear();
                cloneagotchi.gameAnimate();
                let randNum = Math.round(Math.random())
                if (randNum) {
                    gameDecision = "left";
                }
                else {
                    gameDecision = "right";
                }
            }
            else if (extraInput == "left" || extraInput == "right") {
                if (gameDecision == "left") {
                    cloneagotchi.gameAnimate("lr", "left");
                }
                else if (gameDecision == "right") {
                    cloneagotchi.gameAnimate("lr", "right");
                }
                if (gameDecision == extraInput) {
                    stateHandler("winScreen");
                    setTimeout(() => {
                        gameCount++;
                        gameWinCount++;
                        if (gameCount>=5) {
                            if (gameWinCount>=3) {
                                playSound("regularNoti");
                                cloneagotchi.exercised(1);
                            }
                            else {
                                playSound("badNoti2");
                                cloneagotchi.exercised(0);
                            }
                            gameWinCount = 0;
                            gameCount = 0;
                            stateHandler("main")
                        }
                        else {
                            stateHandler("game-leftright");
                        }
                    }, 1000);
                }
    
                else if (gameDecision != extraInput) {
                    stateHandler("loseScreen");
                    setTimeout(() => {
                        gameCount++;
                        if (gameCount>=5) {
                            if (gameWinCount>=3) {
                                playSound("regularNoti");
                                cloneagotchi.exercised(1);
                            }
                            else {
                                playSound("badNoti2");
                                cloneagotchi.exercised(0);
                            }
                            gameWinCount = 0;
                            gameCount = 0;
                            stateHandler("main")
                        }
                        else {
                            stateHandler("game-leftright");
                        }
                    }, 1000);
                }
            }
            break;
        case "game-higherlower":
            if (extraInput == undefined) {
                clearInterval(animateInterval);
                canvasClear();
                cloneagotchi.gameAnimate();
                gameDecision = Math.round(Math.random()*9)
                setTimeout(() => {
                    ctx.fillStyle = 'black';
                    ctx.font = '25px Lucida Console';
                    ctx.fillText(`${gameDecision}`, 50, 75);
                }, 1);
            }
            else if (extraInput == "higher" || extraInput == "lower") {
                let gameDecision2 = Math.round(Math.random()*9);
                while (gameDecision == gameDecision2) {
                    gameDecision2 = Math.round(Math.random()*9);
                }
                setTimeout(() => {
                    ctx.fillStyle = 'black';
                    ctx.font = '25px Lucida Console';
                    ctx.fillText(`${gameDecision}`, 50, 75);
                    ctx.fillText(`${gameDecision2}`, 225, 75);
                }, 1);
                if (gameDecision > gameDecision2) {
                    cloneagotchi.gameAnimate("hl", "lower");
                    higherOrLower = "lower";
                }
                else if (gameDecision < gameDecision2) {
                    cloneagotchi.gameAnimate("hl", "higher");
                    higherOrLower = "higher";
                }
                if (higherOrLower == extraInput) {
                    stateHandler("winScreen");
                    setTimeout(() => {
                        gameCount++;
                        gameWinCount++;
                        if (gameCount>=5) {
                            if (gameWinCount>=3) {
                                playSound("regularNoti");
                                cloneagotchi.exercised(1);
                            }
                            else {
                                playSound("badNoti2");
                                cloneagotchi.exercised(0);
                            }
                            gameWinCount = 0;
                            gameCount = 0;
                            higherOrLower = undefined;
                            gameDecision2 = undefined;
                            stateHandler("main")
                        }
                        else {
                            stateHandler("game-higherlower");
                        }
                    }, 1000);
                }

                else if (higherOrLower != extraInput) {
                    stateHandler("loseScreen");
                    setTimeout(() => {
                        gameCount++;
                        if (gameCount>=5) {
                            if (gameWinCount>=3) {
                                playSound("regularNoti");
                                cloneagotchi.exercised(1);
                            }
                            else {
                                playSound("badNoti2");
                                cloneagotchi.exercised(0);
                            }
                            gameWinCount = 0;
                            gameCount = 0;
                            higherOrLower = undefined;
                            gameDecision2 = undefined;
                            stateHandler("main")
                        }
                        else {
                            stateHandler("game-higherlower");
                        }
                    }, 1000);
                }
            }
            break;
        case "winScreen":
            playSound("beep1");
            setTimeout(() => {
                cloneagotchi.gameAnimate(undefined, "win");
            }, 500);
            break;
        case "loseScreen":
            playSound("beep3");
            setTimeout(() => {
                cloneagotchi.gameAnimate(undefined, "lose");
            }, 500);
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
            clearInterval(animateInterval);
            canvasClear();
            subMenuSelection = 1;
            ctx.fillStyle = 'black';
            ctx.font = '25px Lucida Console';
            ctx.fillText(`Hunger: ${cloneagotchi.hunger}`, 50, 75);
            ctx.fillText(`Happiness: ${cloneagotchi.happiness}`, 50, 125);
            break;
        case "discipline":
            if (cloneagotchi.naughty) {
                cloneagotchi.discipline++;
                cloneagotchi.naughty = false;
                playSound("regularNoti");
            }
            else if(cloneagotchi.naughty == false) {
                if (cloneagotchi.happiness > 0) {
                    cloneagotchi.happiness --;
                    cloneagotchi.checkCare();
                }
                playSound("badNoti2");
            }
            stateHandler("main");
            break;
        case "moodMenu":
            clearInterval(animateInterval);
            canvasClear();
            ctx.fillStyle = 'black';
            ctx.font = '25px Lucida Console';
            ctx.fillText('Your cloneagotchi', 25, 75);
            ctx.fillText(`feels ${cloneagotchi.moodCheck()}`, 50, 125);
            break;
        case "locked":
            const mainIcons = document.getElementsByClassName("menu");
            for (i=0;i<mainIcons.length;i++) {
                mainIcons[i].classList.add("grayedOut");
            }
            break;
    }
}

function saveGame() {
    localStorage.setItem('cloneagotchiData', JSON.stringify(cloneagotchi));
    localStorage.setItem('previousSeconds', JSON.stringify(currentSeconds));
    localStorage.setItem('foodClock', JSON.stringify(foodClock));
    localStorage.setItem('happinessClock', JSON.stringify(happinessClock));
    localStorage.setItem('lightsOn', JSON.stringify(lightsOn));
}

function loadGame() {
    let currentTime = new Date();
    currentSeconds = Math.round(currentTime.getTime()/1000);
    const cloneagotchiData = JSON.parse(localStorage.getItem('cloneagotchiData'));
    cloneagotchi = new Cloneagotchi(cloneagotchiData.age, cloneagotchiData.sex, cloneagotchiData.growthStage, cloneagotchiData.species, cloneagotchiData.happiness, cloneagotchiData.hunger, cloneagotchiData.weight, cloneagotchiData.discipline, cloneagotchiData.illness, cloneagotchiData.waste, cloneagotchiData.naughty, cloneagotchiData.careMistakes);
    startSeconds = parseInt(localStorage.getItem('startSeconds'));
    const previousSeconds = parseInt(localStorage.getItem('previousSeconds'));
    timeDifference = currentSeconds - previousSeconds;
    lightsOn = JSON.parse(localStorage.getItem('lightsOn'));
    foodClock = JSON.parse(localStorage.getItem('foodClock'));
    happinessClock = JSON.parse(localStorage.getItem('happinessClock'));
    cloneagotchi.timeAwayChange();
}

function updateTime() {
    timeInterval = setInterval(() => {
        let currentTime = new Date();
        let currentHour = currentTime.getHours();
        currentSeconds = Math.round(currentTime.getTime()/1000);
        foodClock++;
        happinessClock++;
        document.getElementById("headTimer").textContent = currentSeconds;
        if (cloneagotchi != null) {
            cloneagotchi.randomStatChange();
            cloneagotchi.guaranteedStatChange();
            cloneagotchi.scriptedStatChange();
            if (lightsOn == false) {
                lightsClock = 0;
            }
            else if (lightLock == false) {
                lightsClock++;
                if (currentHour <= 7 || currentHour >= 22) { //In the future, different species/growthstages will have different bedtimes. Get this to work without calling it every second
                    lightLock = true;
                    cloneagotchi.cry()
                    setTimeout(() => {
                        lightLock = false;
                    }, 5000);
                    if (lightsClock >= 5) {
                        lightsClock = 0;
                        playSound("badNoti2");
                        cloneagotchi.careMistakes++;
                    }
                }
            }
        }
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
            for (j=0;j<appendedFrame.length;j++) {
            let appendedPixels = appendedFrame[j];
                for (i=0;i<appendedPixels[0].length;i++) {
                    canvasDraw(appendedPixels[0][i]);
                }
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

function debugStatShow() {
    savedStats = JSON.stringify(localStorage.getItem('cloneagotchiData'));
    statsp = document.getElementById("stats");
    statsp.textContent = savedStats;
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
    const { menuSelectPreset1 } = await import('./pixelData.js');
    const { menuSelectPreset2 } = await import('./pixelData.js');
    setTimeout(() => {
        button.classList.remove("buttonActive");
    }, 100);
    switch (state) {
        case "main":
            mainIcon(1);
            break;
        case "foodMenu":
            playSound("beep2");
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
        case "gameMenu":
            playSound("beep2");
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
            ctx.font = '25px Lucida Console';
            ctx.fillText('Left/Right', 50, 75);
            ctx.fillText('Higher/Lower', 50, 125);
            break;
        case "game-leftright": //User inputs "left"
            stateHandler("game-leftright", "left");
            break;
        case "game-higherlower": //User inputs "lower"
            stateHandler("game-higherlower", "lower");
            break;
        case "statMenu":
            playSound("beep2");
            subMenuSelection++
            if (subMenuSelection < 3) {
                if (subMenuSelection == 1) {
                    canvasClear();
                    ctx.fillStyle = 'black';
                    ctx.font = '25px Lucida Console';
                    ctx.fillText(`Hunger: ${cloneagotchi.hunger}`, 50, 75);
                    ctx.fillText(`Happiness: ${cloneagotchi.happiness}`, 50, 125);
                }
                else if (subMenuSelection == 2) {
                    canvasClear();
                    ctx.fillStyle = 'black';
                    ctx.font = '25px Lucida Console';
                    ctx.fillText(`Weight: ${cloneagotchi.weight} lbs`, 50, 75);
                    ctx.fillText(`Discipline: ${cloneagotchi.discipline}`, 50, 125);
                }
            }
            else {
                subMenuSelection = 1;
                canvasClear();
                ctx.fillStyle = 'black';
                ctx.font = '25px Lucida Console';
                ctx.fillText(`Hunger: ${cloneagotchi.hunger}`, 50, 75);
                ctx.fillText(`Happiness: ${cloneagotchi.happiness}`, 50, 125);
            }
            break;
        case "moodMenu":
            subMenuSelection = 0;
            playSound("beep3");
            stateHandler("main");
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
                        stateHandler("discipline");
                        break;
                    case 7:
                        playSound("beep1");
                        stateHandler("moodMenu");
                        break;
                }
            break;
            case "foodMenu":
                if(subMenuSelection == 1) { //Give a meal
                    playSound("beep1");
                    cloneagotchi.feed("meal");
                    subMenuSelection = 1;
                    stateHandler("locked");
                    foodTimeout = setTimeout(() => {
                        clearInterval(animateInterval);
                        stateHandler("main");
                    }, 1000);
                }
                else if (subMenuSelection == 2) { //Give a snack
                    playSound("beep1");
                    cloneagotchi.feed("snack");
                    subMenuSelection = 1;
                    stateHandler("locked");
                    foodTimeout = setTimeout(() => {
                        stateHandler("main");
                    }, 1000);
                }
                break;
            case "gameMenu":
                if(subMenuSelection == 1) {
                    playSound("beep1");
                    stateHandler("game-leftright");
                }
                else if (subMenuSelection == 2) {
                    playSound("beep1");
                    stateHandler("game-higherlower");
                }
                break;
            case "game-leftright": //User inputs "right"
                stateHandler("game-leftright", "right");
                break;
            case "game-higherlower": //User inputs "higher"
                stateHandler("game-higherlower", "higher");
                break;
            case "statMenu":
            case "moodMenu":
                subMenuSelection = 0;
                playSound("beep3");
                stateHandler("main");
                break;
            default:
            case "locked":
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
        case "locked":
        default:
            break;
        case "foodMenu":
        case "gameMenu":
        case "statMenu":
        case "moodMenu":
            subMenuSelection = 1;
            playSound("beep3");
            stateHandler("main");
            break;
        case "game-leftright":
        case "game-higherlower":
            gameCount = 0;
            gameWinCount = 0;
            playSound("beep3");
            stateHandler("main");
            break;
    }
}

canvasInit();