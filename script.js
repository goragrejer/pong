// --- Player Input Logic ---

// Set the velocity (dy) based on the key pressed
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        // Player 1: W (Up) and S (Down)
        case 'w':
        case 'W':
            player1.dy = -7; // Move Up
            break;
        case 's':
        case 'S':
            player1.dy = 7; // Move Down
            break;

        // Player 2: ArrowUp and ArrowDown
        case 'ArrowUp':
            player2.dy = -7; // Move Up
            break;
        case 'ArrowDown':
            player2.dy = 7; // Move Down
            break;
    }
});

// Stop the paddle movement when the key is released
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
