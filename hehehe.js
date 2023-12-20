let box = document.getElementById("box");
let x = 637;
let y = 277;
let speed = 10;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

let LEFT = false;
let RIGHT = false;
let UP = false;
let DOWN = false;

function move() {
    if (LEFT && x > 387) {
        x -= speed;
        box.style.left = x + "px";
    }
    if (RIGHT && x < 827) {
        x += speed;
        box.style.left = x + "px";
    }
    if (UP && y - 10 > 87) {
        y -= speed;
        box.style.top = y + "px";
    }
    if (DOWN && y < 531 - speed) {
        y += speed;
        box.style.top = y + "px";
    }
}

document.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (e.key === "ArrowUp") {
        UP = true;
        move();
    }
    if (e.key === "ArrowDown") {
        DOWN = true;
        move();
    }
    if (e.key === "ArrowLeft") {
        LEFT = true;
        move();
    }
    if (e.key === "ArrowRight") {
        RIGHT = true;
        move();
    }
})

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") {
        UP = false;
        move();
    }
    if (e.key === "ArrowDown") {
        DOWN = false;
        move();
    }
    if (e.key === "ArrowLeft") {
        LEFT = false;
        move();
    }
    if (e.key === "ArrowRight") {
        RIGHT = false;
        move();
    }
})

/*document.addEventListener("keydown", (e) => {
    console.log(e);
    if (e.key === "ArrowLeft") {
        if (x > 387) {
            x -= speed;
            box.style.left = x + "px";
        }
    } else if (e.key === "ArrowUp") {
        if (y - 10 > 45) {
            y -= speed;
            box.style.top = y + "px";
        }
    } else if (e.key === "ArrowRight") {
        if (x < 877) {
            x += speed;
            box.style.left = x + "px";
        }
    } else if (e.key === "ArrowDown") {
        if (y < 535) {
            y += speed;
            box.style.top = y + "px";
        }
    }
})*/