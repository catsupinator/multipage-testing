class Animation {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.animatables = [];
        this.lastUpdate = null;
    }
    addAnimatable(animatable) {
        this.animatables.push(animatable);
        animatable.setAnimation(this);
    }
    removeAnimatable(animatable) {
        this.animatables.splice(this.animatables.indexOf(animatable), 1);
    }
    start() {
        requestAnimationFrame((timestamp) => {this.update(timestamp)});
    }
    update(timestamp) {
        if (this.lastUpdate === null) {
            this.lastUpdate = timestamp;
        }

        const deltaT = (timestamp - this.lastUpdate) / 1000;

        this.lastUpdate = timestamp;

        this.animatables.forEach(animatable => {
            animatable.update(deltaT);
        })

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.animatables.forEach(animatable => {
            animatable.render(this.ctx);
        })

        requestAnimationFrame(ts => this.update(ts));
    }
}

class Animatable {
    update(deltaT) {}

    render(ctx) {}

    setAnimation(animation) {
        this.animation = animation;
    }
}

class horizontalBall extends Animatable {
    constructor(posX, posY) {
        super();
        this.posX = posX;
        this.posY = posY;
        this.velocity = 3;
        this.totalTime = 0;
        this.radius = 6;
        this.height = 2;
        this.width = 2;
    }
    update(deltaT) {
        this.totalTime += deltaT;
        this.posX += this.velocity;
        if (this.posX + this.radius >= this.animation.width) {
            this.posX = this.animation.width - this.radius;
            this.velocity = -this.velocity;
        }
        if (this.posX <= 0 + this.radius) {
            this.posX = this.radius;
            this.velocity = - this.velocity;
        }
        endState(player, this);
    }
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class verticalBall extends Animatable {
    constructor(posX, posY) {
        super();
        this.posX = posX;
        this.posY = posY;
        this.velocity = 3;
        this.totalTime = 0;
        this.radius = 6;
        this.height = 2;
        this.width = 2;
    }
    update(deltaT) {
        this.totalTime += deltaT;
        this.posY += this.velocity;
        if (this.posY + this.radius >= this.animation.width) {
            this.posY = this.animation.width - this.radius;
            this.velocity = -this.velocity;
        }
        if (this.posY <= 0 + this.radius) {
            this.posY = this.radius;
            this.velocity = - this.velocity;
        }
        endState(player, this);
    }
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class point extends Animatable {
    constructor(posX, posY) {
        super();
        this.posX = posX;
        this.posY = posY;
        this.totalTime = 0;
        this.radius = 6;
        this.height = 10;
        this.width = 10;
    }
    update(deltaT) {
        this.totalTime += deltaT;
        collisionWithPoint(player, this);
    }
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Player extends Animatable {
    constructor(posX, posY) {
        super();
        this.posX = posX;
        this.posY = posY;
        this.velocity = 5;
        this.totalTime = 0;
        this.radius = 10;
        this.length = 20;
        this.width = 20;
    }
    update(deltaT) {
        this.totalTime += deltaT;
        move();
    }
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.drawImage(smile2, this.posX - 10, this.posY - 10, 20, 20);

    }
}

class score extends Animatable {
    constructor(posX, posY) {
        super();
        this.posX = posX;
        this.posY = posY;
        this.score = 0;
    }
    update(deltaT) {
        this.totalTime += deltaT;
    }
    render(ctx) {
        ctx.font = "20px Comic Sans MS";
        ctx.fillStyle = "white";
        ctx.fillText(`Score: ${this.score}`, this.posX, this.posY);
    }
}

class gameOverScreen extends Animatable {
    constructor(posX, posY) {
        super();
        this.posX = posX;
        this.posY = posY;
    }
    update(deltaT) {
        this.totalTime += deltaT;
    }
    render(ctx) {
        ctx.font = "50px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.fillText("Game Over", this.posX, this.posY);
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const eyeball = document.getElementById("eyeball");
const smile = document.getElementById("smile");
const smile2 = document.getElementById("smile2");

const animation = new Animation(ctx, canvas.width, canvas.height);
animation.start();

const player = new Player(225, 225);
animation.addAnimatable(player);

const pointball = new point((Math.random() * 150) + 20, (Math.random() * 410) + 30);
animation.addAnimatable(pointball);

const firstDanger = new verticalBall(pointball.posX, pointball.posY);
animation.addAnimatable(firstDanger);

const playerScore = new score(5, 20);
animation.addAnimatable(playerScore);

const gameOver = new gameOverScreen(90, 225);

canvas.addEventListener("mousedown", e => {
    if (ballSwitcher) {
        const ball = new horizontalBall(e.offsetX, e.offsetY);
        animation.addAnimatable(ball);
    } else {
        const otherball = new verticalBall(e.offsetX, e.offsetY);
        animation.addAnimatable(otherball);
    }
    ballSwitcher = !ballSwitcher;
})

let ballSwitcher = false;
let LEFT = false;
let RIGHT = false;
let UP = false;
let DOWN = false;

document.getElementById("reset-button").addEventListener("click", () => {
    location.reload();
})

function move() {
    if (LEFT && player.posX >= player.radius + player.velocity) {
        player.posX -= player.velocity;
    }
    if (RIGHT && player.posX <= animation.width - player.radius - player.velocity) {
        player.posX += player.velocity;
    }
    if (UP && player.posY >= player.radius + player.velocity) {
        player.posY -= player.velocity;
    }
    if (DOWN && player.posY <= animation.height - player.radius - player.velocity) {
        player.posY += player.velocity;
    }
}

function collisionWithPoint(obj1, obj2) {
    if ((obj1.posX + obj1.radius >= obj2.posX - obj2.radius)
        && (obj1.posX - obj1.radius <= obj2.posX + obj2.radius)
        && (obj1.posY + obj1.radius >= obj2.posY - obj2.radius)
        && (obj1.posY - obj1.radius <= obj2.posY + obj2.radius)) {
            animation.removeAnimatable(obj2);
            animation.addAnimatable(new point((Math.random() * (canvas.width - 30)) + 10, (Math.random() * (canvas.height - 30)) + 10));
            if (ballSwitcher) {
                animation.addAnimatable(new verticalBall((Math.random() * (canvas.width - 30)) + 10, (Math.random() * (canvas.height - 30)) + 10)); //obj1.posX + 40, obj1.posY original positioning, second try: obj1.posY, obj1.posX + 30
            } else {
                animation.addAnimatable(new horizontalBall((Math.random() * (canvas.width - 30)) + 10, (Math.random() * (canvas.height - 30)) + 10)); //obj1.posX + 40, obj1.posY, second try: obj1.posY + 30, obj1.posX
            }
            ballSwitcher = !ballSwitcher;
            playerScore.score += 1;
        }
}

function endState(obj1, obj2) {
    if ((obj1.posX + obj1.radius >= obj2.posX - obj2.radius)
    && (obj1.posX - obj1.radius <= obj2.posX + obj2.radius)
    && (obj1.posY + obj1.radius >= obj2.posY - obj2.radius)
    && (obj1.posY - obj1.radius <= obj2.posY + obj2.radius)) {
        if (playerScore.score % 8 === 0) {
            animation.removeAnimatable(obj2);
        } else {
            animation.animatables = [];
            animation.addAnimatable(gameOver);
            animation.addAnimatable(playerScore);
            document.body.dataset.gameover = true;
            document.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    location.reload();
                }   
            })
        }
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "w") {
        UP = true;
    }
    if (e.key === "ArrowDown" || e.key === "s") {
        DOWN = true;
    }
    if (e.key === "ArrowLeft" || e.key === "a") {
        LEFT = true;
    }
    if (e.key === "ArrowRight" || e.key === "d") {
        RIGHT = true;
    }
})

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp" || e.key === "w") {
        UP = false;
    }
    if (e.key === "ArrowDown" || e.key === "s") {
        DOWN = false;
    }
    if (e.key === "ArrowLeft" || e.key === "a") {
        LEFT = false;
    }
    if (e.key === "ArrowRight" || e.key === "d") {
        RIGHT = false;
    }
})