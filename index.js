let gameState = "start";
let currentTime = new Date();

document.addEventListener('keydown', buttonChoose, false);

function updateTime() {
    setInterval(() => {
        currentTime = new Date();
        document.getElementById("headTimer").textContent = currentTime;
    }, 1000);
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

updateTime();