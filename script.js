const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

let frogger;
let logs = [];
let cars = [];
let gameRunning = false;
let score = 0;
const grid = 40;
const frogSize = grid - 10;
const logSpeed = 2;  // Increased log speed
const carSpeed = 4;  // Increased car speed

// Load images
const frogImage = new Image();
frogImage.src = 'frog.png';

const logImage = new Image();
logImage.src = 'log.png';

const carImage = new Image();
carImage.src = 'car.png';

const roadImage = new Image();
roadImage.src = 'road.jpg'; // Path to your road background JPEG image

const waterImage = new Image();
waterImage.src = 'water.jpg'; // Path to your water background JPEG image

function drawBackground() {
    // Draw the water section (top half)
    ctx.drawImage(waterImage, 0, 0, canvas.width, canvas.height / 2);

    // Draw the road section (bottom half)
    ctx.drawImage(roadImage, 0, canvas.height / 2, canvas.width, canvas.height / 2);
}

class Frogger {
    constructor() {
        this.reset();
        this.width = frogSize;
        this.height = frogSize;
        this.moving = false;
        this.direction = null;
        this.onLog = false;
    }

    draw() {
        ctx.drawImage(frogImage, this.x, this.y, this.width, this.height);
    }

    update() {
        if (this.moving) {
            if (this.direction === 'up') {
                this.y -= grid;
            } else if (this.direction === 'left') {
                this.x -= grid;
            } else if (this.direction === 'right') {
                this.x += grid;
            }
            this.moving = false;
        }

        if (this.y < 0) {
            score++;
            document.getElementById('score').innerText = `Score: ${score}`;
            this.reset();
        }

        if (this.x < 0) {
            this.x = 0;
        }

        if (this.x > canvas.width - this.width) {
            this.x = canvas.width - this.width;
        }
    }

    reset() {
        this.x = canvas.width / 2 - frogSize / 2;
        this.y = canvas.height - frogSize - 10;
        this.onLog = false;
    }
}

class Log {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = grid * 2;
        this.height = grid - 10;
    }

    draw() {
        ctx.drawImage(logImage, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += logSpeed;
        if (this.x > canvas.width) {
            this.x = -this.width;
        }
    }

    contains(frog) {
        return (
            this.x < frog.x + frog.width &&
            this.x + this.width > frog.x &&
            this.y < frog.y + frog.height &&
            this.y + this.height > frog.y
        );
    }
}

class Car {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = grid * 2;
        this.height = grid - 10;
    }

    draw() {
        ctx.drawImage(carImage, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= carSpeed;
        if (this.x + this.width < 0) {
            this.x = canvas.width;
        }
    }

    collides(frog) {
        return (
            this.x < frog.x + frog.width &&
            this.x + this.width > frog.x &&
            this.y < frog.y + frog.height &&
            this.y + this.height > frog.y
        );
    }
}

function init() {
    drawBackground(); // Draw the background before game elements
    frogger = new Frogger();
    logs = [
        new Log(0, grid * 2),
        new Log(200, grid * 2),
        new Log(100, grid * 3),    // Adjusted position
        new Log(250, grid * 3),    // Adjusted position
        new Log(50, grid * 4),    // Adjusted position
        new Log(300, grid * 4)     // Adjusted position
    ];
    cars = [
        new Car(400, grid * 6),
        new Car(200, grid * 6),
        new Car(300, grid * 8),
        new Car(100, grid * 8),
    ];
}

function animate() {
    drawBackground(); // Draw the background every frame
    frogger.draw();
    frogger.update();

    let frogOnLog = false;
    logs.forEach(log => {
        log.draw();
        log.update();
        if (log.contains(frogger)) {
            frogOnLog = true;
            frogger.x += logSpeed;
        }
    });

    if (frogOnLog) {
        frogger.onLog = true;
    } else {
        if (frogger.y < grid * 5 && frogger.y >= grid * 2) {
            frogger.reset();
        }
        frogger.onLog = false;
    }

    cars.forEach(car => {
        car.draw();
        car.update();
        if (car.collides(frogger)) {
            frogger.reset();
        }
    });

    if (gameRunning) {
        requestAnimationFrame(animate);
    }
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        animate();
    }
}

document.getElementById('startButton').addEventListener('click', () => {
    init();
    startGame();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') {
        frogger.moving = true;
        frogger.direction = 'up';
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        frogger.moving = true;
        frogger.direction = 'left';
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        frogger.moving = true;
        frogger.direction = 'right';
    }
});

init();
