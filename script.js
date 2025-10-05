// --- Step 1: Setup Canvas and Context ---
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d'); // The '2d' context allows us to draw shapes and text

const W = canvas.width;
const H = canvas.height;

// --- Step 2: Game Variables and Objects ---
let gameLoop; // Will hold our main game animation loop

// Paddle properties
const PADDLE_W = 10;
const PADDLE_H = 80;
const PADDLE_COLOR = '#ecf0f1'; // White

let player1 = {
    x: 10,
    y: H / 2 - PADDLE_H / 2,
    score: 0,
    dy: 0 // Velocity (how fast the paddle is moving)
};

let player2 = {
    x: W - PADDLE_W - 10,
    y: H / 2 - PADDLE_H / 2,
    score: 0,
    dy: 0
};

// Ball properties
const BALL_SIZE = 10;
const BALL_COLOR = '#e74c3c'; // Red

let ball = {
    x: W / 2,
    y: H / 2,
    dx: 5,  // Horizontal velocity
    dy: 5   // Vertical velocity
};

// --- Step 3: Drawing Functions ---

/**
 * Draws a rectangular object (paddle or ball).
 */
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

/**
 * Draws the current score.
 */
function drawScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `Player 1: ${player1.score} | Player 2: ${player2.score}`;
}

/**
 * The main drawing function that clears the canvas and draws all elements.
 */
function draw() {
    // 1. Clear the entire canvas on every frame
    drawRect(0, 0, W, H, 'black'); 
    
    // 2. Draw the dividing line (optional but nice)
    ctx.fillStyle = 'white';
    ctx.fillRect(W / 2 - 1, 0, 2, H);

    // 3. Draw Paddles
    drawRect(player1.x, player1.y, PADDLE_W, PADDLE_H, PADDLE_COLOR);
    drawRect(player2.x, player2.y, PADDLE_W, PADDLE_H, PADDLE_COLOR);

    // 4. Draw Ball
    drawRect(ball.x - BALL_SIZE / 2, ball.y - BALL_SIZE / 2, BALL_SIZE, BALL_SIZE, BALL_COLOR);

    // 5. Draw Score
    drawScore();
}

/**
 * Resets the ball to the center after a point is scored.
 */
function resetBall() {
    ball.x = W / 2;
    ball.y = H / 2;
    // Reverse direction and make it random
    ball.dx = -ball.dx; 
    ball.dy = (Math.random() * 10 - 5); // New random vertical speed
}

// --- Step 4: Game Loop and Initialization ---

/**
 * Main game loop: Updates positions, checks collisions, and redraws.
 */
function update() {
    // 1. Update Paddles (movement logic will be added here)
    player1.y += player1.dy;
    player2.y += player2.dy;

    // Keep paddles on screen
    player1.y = Math.max(0, Math.min(H - PADDLE_H, player1.y));
    player2.y = Math.max(0, Math.min(H - PADDLE_H, player2.y));

    // 2. Update Ball Position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // (Collision logic goes here)

    // 3. Draw everything
    draw();
}

/**
 * Initializes the game and starts the loop.
 */
function startGame() {
    // If a loop is already running, clear it first
    if (gameLoop) clearInterval(gameLoop);
    
    // Set the game to update 60 times per second (60 FPS)
    gameLoop = setInterval(update, 1000 / 60); 
}

// --- Event Listeners ---
document.getElementById('startButton').addEventListener('click', startGame);

// We need an initial draw to show the starting state
draw();
