function buttonAnimate(buttonNum) {
    let button = document.getElementById(`button${buttonNum}`)
    button.classList.add("buttonActive");
    setTimeout(() => {
        button.classList.remove("buttonActive");
    }, 100);
}