// --- Step 1: Setup Canvas and Context ---
const canvas = document.getElementById('pongCanvas');
// The '2d' context allows us to draw shapes and text
const ctx = canvas.getContext('2d'); 

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
    
    // 2. Draw the dividing line 
    ctx.fillStyle = 'white';
    ctx.fillRect(W / 2 - 1, 0, 2, H);

    // 3. Draw Paddles
    drawRect(player1.x, player1.y, PADDLE_W, PADDLE_H, PADDLE_COLOR);
    drawRect(player2.x, player2.y, PADDLE_W, PADDLE_H, PADDLE_COLOR);

    // 4. Draw Ball
    // We draw the ball slightly offset to use its center (x, y) for collision
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
    // Reverse direction and randomize vertical speed
    ball.dx = -ball.dx; 
    // Random vertical speed between -5 and 5
    ball.dy = (Math.random() * 10 - 5); 
}

// --- Step 4: Game Loop and Physics ---

/**
 * Main game loop: Updates positions, checks collisions, and redraws.
 */
function update() {
    // 1. Update Paddles
    player1.y += player1.dy;
    player2.y += player2.dy;

    // Keep paddles on screen
    player1.y = Math.max(0, Math.min(H - PADDLE_H, player1.y));
    player2.y = Math.max(0, Math.min(H - PADDLE_H, player2.y));

    // 2. Update Ball Position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 3. Wall Collision (Top/Bottom)
    // BALL_SIZE / 2 is used because the ball's (x, y) is its center
    if (ball.y < BALL_SIZE / 2 || ball.y > H - BALL_SIZE / 2) {
        ball.dy = -ball.dy; // Reverse vertical direction
    }

    // 4. Scoring (Left/Right Walls)
    if (ball.x < 0) {
        // Ball hit Player 1's goal (left side)
        player2.score++;
        resetBall();
    } else if (ball.x > W) {
        // Ball hit Player 2's goal (right side)
        player1.score++;
        resetBall();
    }

    // 5. Paddle Collision (Player 1 - Left)
    // Check if ball is horizontally aligned with the paddle AND vertically aligned
    if (ball.x < player1.x + PADDLE_W + BALL_SIZE / 2 && ball.x > player1.x) {
        if (ball.y > player1.y && ball.y < player1.y + PADDLE_H) {
            // Collision detected!
            ball.dx = -ball.dx; // Reverse horizontal direction
            // Add spin/angle based on where the ball hit the paddle
            let collidePoint = (ball.y - (player1.y + PADDLE_H / 2)) / (PADDLE_H / 2);
            ball.dy = collidePoint * 8; 
        }
    }

    // 6. Paddle Collision (Player 2 - Right)
    if (ball.x > player2.x - BALL_SIZE / 2 && ball.x < player2.x + PADDLE_W) {
        if (ball.y > player2.y && ball.y < player2.y + PADDLE_H) {
            // Collision detected!
            ball.dx = -ball.dx; // Reverse horizontal direction
            // Add spin/angle
            let collidePoint = (ball.y - (player2.y + PADDLE_H / 2)) / (PADDLE_H / 2);
            ball.dy = collidePoint * 8; 
        }
    }

    // 7. Draw everything
    draw();
}

/**
 * Initializes the game and starts the loop.
 */
function startGame() {
    // If a loop is already running, clear it first
    if (gameLoop) clearInterval(gameLoop);
    
    // Reset scores just in case
    player1.score = 0;
    player2.score = 0;
    drawScore();

    // Reset ball to center and start its movement
    resetBall();
    
    // Set the game to update 60 times per second (60 FPS)
    gameLoop = setInterval(update, 1000 / 60); 
}

// --- Event Listeners ---

// Start button
document.getElementById('startButton').addEventListener('click', startGame);

// Key presses (Movement initiation)
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        // Player 1: W (Up) and S (Down)
        case 'w':
        case 'W':
            player1.dy = -7; 
            break;
        case 's':
        case 'S':
            player1.dy = 7; 
            break;

        // Player 2: ArrowUp and ArrowDown
        case 'ArrowUp':
            player2.dy = -7; 
            break;
        case 'ArrowDown':
            player2.dy = 7; 
            break;
    }
});

// Key releases (Movement stop)
document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
        case 'W':
        case 's':
        case 'S':
            player1.dy = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            player2.dy = 0;
            break;
    }
});

// Initial draw to show the starting state
draw();
