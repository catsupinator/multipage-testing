let isClicked = false;

document.getElementById("menu-button").addEventListener("click", () => {
    isClicked = !isClicked;
    document.body.dataset.pressed = isClicked;
})