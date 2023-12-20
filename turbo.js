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

class test extends Animatable {
    constructor(x, y) {
        super();
        this.width = 30;
        this.height = 30;
        this.x = x;
        this.y = y;
        this.angle = 0;
    }
    update(deltaT) {
        this.totalTime += deltaT;
    }
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        ctx.drawImage(dude, this.x - this.width/2, this.y - this.height/2, 30, 30);
        rotationTest();
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const dude = document.getElementById("dude");
let mouseX = 0;
let mouseY = 200;

const animation = new Animation(ctx, canvas.width, canvas.height);
animation.start();

const square = new test(200, 200);
animation.addAnimatable(square);

canvas.addEventListener("mousemove", (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
});

function rotationTest() {
    let xDist = square.x - mouseX;
    let yDist = square.y - mouseY;
    angle = (Math.atan(xDist/yDist));
    if (square.angle !== angle) {
        ctx.translate(square.x, square.y);
        ctx.rotate(square.angle - angle);
        ctx.translate(-square.x, -square.y);
        square.angle = angle;
    }
}