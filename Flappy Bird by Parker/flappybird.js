//board

let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;

let birdImage;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

let gravity = 0.5;
let birdSpeed = 0;

let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let pipeFrequency = 1500; // in milliseconds

function addPipe() {
    let pipeY = Math.random() * (boardHeight - pipeGap - 100) + 50;
    pipes.push({ x: boardWidth, y: pipeY });
}

function checkCollision(bird, pipe) {
    // Check collision with the top pipe
    if (bird.x < pipe.x + pipeWidth &&
        bird.x + bird.width > pipe.x &&
        bird.y < pipe.y) {
        return true;
    }

    // Check collision with the bottom pipe
    if (bird.x < pipe.x + pipeWidth &&
        bird.x + bird.width > pipe.x &&
        bird.y + bird.height > pipe.y + pipeGap) {
        return true;
    }

    return false;
}

function update() {
    birdSpeed += gravity;
    bird.y += birdSpeed;

    if (bird.y + bird.height > boardHeight) {
        bird.y = boardHeight - bird.height;
        birdSpeed = 0;
        // Trigger game over logic
        gameOver();
        return;
    }

    context.clearRect(0, 0, boardWidth, boardHeight);

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x -= 2;
        
        if (checkCollision(bird, pipe)) {
            // Trigger game over logic
            gameOver();
            return;
        }

        context.fillStyle = "green";
        context.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        context.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, boardHeight - pipe.y - pipeGap);
    }

    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    requestAnimationFrame(update);
}

function gameOver() {
    console.log("Game Over!");
    // Display game over message
    context.font = "30px Courier New";
    context.fillStyle = "red";
    context.fillText("Game Over", boardWidth / 4, boardHeight / 2);
    
    // Stop the game loop by not calling update again
}

window.onload = function() {
    console.log("Window loaded, initializing game...");
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImage = new Image();
    birdImage.src = "./flappybird.png";
    birdImage.onload = function() {
        console.log("Bird image loaded");
        context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
        console.log("Starting game loop");
        addPipe();
        update();
    }

    window.addEventListener("keydown", function(e) {
        if (e.code === "Space" || e.code === "ArrowUp") {
            birdSpeed = -10;
        }
    });

    setInterval(addPipe, pipeFrequency);
}