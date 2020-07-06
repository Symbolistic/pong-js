let cavas;
let canvasContext;

let ballX = 50;
let ballY = 50;
let ballSpeedX = 15;
let ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;

const WINNING_SCORE = 3;

let showingWinScreen = false;

let paddle1Y = 250;
let paddle2Y = 250;

const PADDLE_THICCNESS = 10; // Yes I named it like that on purpose
const PADDLE_HEIGHT = 100;

function calculateMousePos(event) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = event.clientX - rect.left - root.scrollLeft;
    let mouseY = event.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    }
}

function handleMouseClick(event) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    // Sets the default FPS
    let framesPerSecond = 30;

    // Draws/updates something every frame per second
    setInterval(() => {
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);

    canvas.addEventListener("mousedown", handleMouseClick);

    canvas.addEventListener('mousemove', (event) => {
        let mousePos = calculateMousePos(event);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    });
}

function ballReset() {
    if ( player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE ) {
        showingWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

// This sets up the AI
function computerMovement() {
    let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if (paddle2YCenter < ballY-35) {
        paddle2Y += 6;
    } else if (paddle2YCenter > ballY+35) {
        paddle2Y -= 6;
    }
}


// This controls the movement for the ball
function moveEverything() {
    if (showingWinScreen) {
        return;
    }

    computerMovement();

    ballX += ballSpeedX; // Increases the ball X coordinate, YEEEE BOI WE MOVING!!!
    ballY += ballSpeedY; // Increases the ball Y coordinate, YEEEE BOI WE UP N DOWN woah!!!

    // If we are touching or past the LEFT side of the wall, reverse movement direction
    // YEEEE BOIIII WE MOVING IN REVERSE
    if (ballX <= 0) {

            // This checks if the ball is touching the paddle
            if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;

                let deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
            } else {
                player2Score++; // Must be BEFORE ballReset so we can check win condition
                ballReset();
            } 
            // If we are touching or past the RIGHT side of the wall, reverse.
        } else if (ballX >= canvas.width) {

            // This checks if the ball is touching the paddle
            if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;

                let deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;
            } else {
                player1Score++; // Must be BEFORE ballReset so we can check win condition
                ballReset();
            }
        }  else if (ballY >= canvas.height) {
            ballSpeedY = -ballSpeedY;
        } else if (ballY <= 0) {
            ballSpeedY = -ballSpeedY; // YEEEEE BOI WE MOVING BACK IN THE NORMAL DIRECTION! WOOOOOOOO
        }
}

// This is just a function to setup all the canvas elements
function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
    canvasContext.fill();
}

function drawNet() {
    for (let i = 0; i < canvas.height; i+=40) {
        colorRect(canvas.width/2 - 1, i, 2, 20, "white")
    }
}

// This calls the canvas setup and draws it to the screen
// Leonardo da Vinci would be proud of these drawing skillz!
function drawEverything() {
    // This is the whole game screen
    colorRect(0, 0, canvas.width, canvas.height, "black");

    // Check if we need to show the game winning screen
    if (showingWinScreen) {
        // This sets up the winning score screen and shows who won
        canvasContext.fillStyle = 'white';

        if ( player1Score >= WINNING_SCORE ) {
            canvasContext.fillText("You have won!", canvas.width/2, 200);
        } else if (player2Score >= WINNING_SCORE) {
            canvasContext.fillText("You lost!", canvas.width/2, 200);
        }

        
        canvasContext.fillText("Click to continue", canvas.width/2, 500);
        return;
    }

    // Draw the net
    drawNet();

    // This is the white paddles used to hit the ball
    // Left PLAYER Paddle
    colorRect(0, paddle1Y, PADDLE_THICCNESS, PADDLE_HEIGHT, "white");

    // Right AI Paddle
    colorRect(canvas.width-PADDLE_THICCNESS, paddle2Y, PADDLE_THICCNESS, PADDLE_HEIGHT, "white");

    // DIS IS TEH BALL MAYNE! BOUNCE BOUNCE ALL DAY!
    colorCircle(ballX, ballY, 10, "white");

    // Draw the player1 score text
    canvasContext.fillText(player1Score, 100, 100 );

    // Draw the player2 AKA THE AI score text
    canvasContext.fillText(player2Score, canvas.width-100, 100 );
}